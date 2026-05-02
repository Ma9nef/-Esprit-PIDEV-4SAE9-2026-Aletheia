FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY microservices/offer/pom.xml .
RUN mvn dependency:go-offline -B

COPY microservices/offer/src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/target/*.jar app.jar
# ML offer recommendation (see ../../ml/offer-recommendation in repo)
COPY ml/offer-recommendation /app/ml/offer-recommendation

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8086
ADD target/offer-0.0.1-SNAPSHOT.jar offer.jar
ENTRYPOINT ["java", "-jar", "offer.jar"]

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
