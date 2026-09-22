package com.api_gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {

        return builder.routes()

                // Product Service
                .route("product-service", route -> route
                        .path("/products/**")
                        .uri("lb://PRODUCT-SERVICE"))

                // Cart Service
                .route("cart-service", route -> route
                        .path("/cart/**")
                        .uri("lb://CART-SERVICE"))

                .build();
    }
}