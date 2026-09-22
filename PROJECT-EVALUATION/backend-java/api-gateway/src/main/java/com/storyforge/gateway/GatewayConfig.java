package com.storyforge.gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;

@Configuration
public class GatewayConfig {

    @Bean
    public RouterFunction<ServerResponse> gatewayRoutes() {

        return route("auth-service")
                .route(path("/api/auth/**"), http())
                .before(uri("http://localhost:8081"))
                .build()

                .and(route("story-service")
                        .route(path("/api/projects/*/stories/**"), http())
                        .before(uri("http://localhost:8083"))
                        .build())

                .and(route("project-service")
                        .route(path("/api/projects/**"), http())
                        .before(uri("http://localhost:8082"))
                        .build())

                .and(route("ai-orchestration")
                        .route(path("/api/ai/**"), http())
                        .before(uri("http://localhost:8084"))
                        .build());
    }
}