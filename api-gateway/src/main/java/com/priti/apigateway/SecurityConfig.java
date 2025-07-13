package com.priti.apigateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    // define security rules that we are going to have in our application
    // Security rules are applied to all the http requests that will be processed by the API Gateway
    //we will use filter chain to apply security rules
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http){
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable) // disable CSRF protection smae as .csrf(csrf -> csrf.disable())
                .authorizeExchange(exchange -> exchange
//                        .pathMatchers("/actuator/**").permitAll() // allow unauthenticated access to auth endpoints
                        .anyExchange().authenticated() // require authentication for all other requests
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
                .build();// enable JWT authentication
    }
}
