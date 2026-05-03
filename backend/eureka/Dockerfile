FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
EXPOSE 8761
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]