package com.priti.apigateway;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.priti.apigateway.user.dto.UserRequestDTO;
import com.priti.apigateway.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        UserRequestDTO registerUserRequest = getUserDetails(token);

        if(userId == null){
            userId = registerUserRequest.getKeycloakId();
        }



        if (userId != null && token != null) {
            String finalUserId = userId;
            return userService.validateUser(userId)
                    .flatMap(exist -> {
                        if(!exist) {
                            //If user does not exist register user otherwise say user already exist and return from there
                            if (registerUserRequest != null) {
                                return userService.registerUser(registerUserRequest)
                                        .then(Mono.empty());
                            } else {
                                log.error("Failed to parse user details from token: {}", token);
//                                return Mono.error(new RuntimeException("Failed to parse user details from token"));
                                return Mono.empty();
                            }


                        } else {
                            log.info("User already exists, so skipping synchronization.");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }
        return chain.filter(exchange);
    }

    private UserRequestDTO getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            UserRequestDTO registerUserRequest = new UserRequestDTO();
            registerUserRequest.setEmail(claims.getStringClaim("email"));
            registerUserRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerUserRequest.setPassword("defaultPassword"); // Set a dummy password
            registerUserRequest.setFirstName(claims.getStringClaim("given_name"));
            registerUserRequest.setLastName(claims.getStringClaim("family_name"));
            return registerUserRequest;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
