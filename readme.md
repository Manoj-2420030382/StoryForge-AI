# SOA Skill Evaluation

This repository contains two Spring Boot microservices examples used for service-oriented architecture evaluation.

## Repository Layout

### Skill 1: Independent Services

Three standalone REST services backed by Spring Data JPA and an in-memory H2 database:

| Service | Port | Base path |
| --- | ---: | --- |
| Restaurant service | `8081` | `/api/restaurants` |
| Order service | `8082` | `/orders` |
| Delivery service | `8083` | `/deliveries` |

Source: `SKILL-EVALUATION/SKILL-1/`

### Skill 2: Service Discovery and Gateway

An e-commerce-style microservices setup using Netflix Eureka and Spring Cloud Gateway:

| Component | Port | Purpose |
| --- | ---: | --- |
| Eureka server | `8761` | Service registry |
| API gateway | `8080` | Entry point and request routing |
| Product service | `8081` | Product endpoint at `/products` |
| Cart service | `8083` | Cart endpoint at `/cart` |

Source: `SKILL-EVALUATION/SKILL-2/`

The gateway uses service discovery to route requests to `PRODUCT-SERVICE` and `CART-SERVICE`.

## Technology Stack

- Java 21
- Spring Boot 4.1.x
- Spring Cloud 2025.1.2 for Skill 2
- Spring Web MVC and Spring Cloud Gateway
- Netflix Eureka
- Spring Data JPA and H2
- Maven Wrapper

## Prerequisites

- JDK 21 or newer
- A terminal with network access for Maven dependency downloads

Check the Java installation:

```bash
java -version
```

## Running Skill 1

Open a separate terminal for each service and run:

```bash
cd SKILL-EVALUATION/SKILL-1/restaurant-service
./mvnw spring-boot:run
```

Use the same command from `order-service` and `delivery-service` to start the other services. On Windows, use `mvnw.cmd` instead of `./mvnw`.

Example requests:

```bash
curl http://localhost:8081/api/restaurants
curl http://localhost:8082/orders
curl http://localhost:8083/deliveries
```

## Running Skill 2

Start Eureka first:

```bash
cd SKILL-EVALUATION/SKILL-2/eureka-server
./mvnw spring-boot:run
```

Then start `product-service`, `cart-service`, and finally `api-gateway` in separate terminals. On Windows, replace `./mvnw` with `mvnw.cmd`.

The Eureka dashboard is available at <http://localhost:8761>.

Access the discovered services through the gateway:

```bash
curl http://localhost:8080/products
curl http://localhost:8080/cart
```

## Building and Testing

Run these commands from the directory of the service you want to build or test:

```bash
./mvnw clean test
./mvnw clean package
```

On Windows:

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd clean package
```

Each service is an independent Maven project; there is no root Maven aggregator.
