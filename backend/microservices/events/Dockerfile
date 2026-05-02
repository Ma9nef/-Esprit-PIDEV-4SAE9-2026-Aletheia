FROM eclipse-temurin:17-jre-alpine
EXPOSE 8090
ADD target/event-microservice-0.0.1-SNAPSHOT.jar events.jar
ENTRYPOINT ["java", "-jar", "events.jar"]
