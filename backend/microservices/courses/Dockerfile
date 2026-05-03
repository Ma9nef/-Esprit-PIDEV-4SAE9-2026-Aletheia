# ---------- STAGE 1: extract layers ----------
FROM eclipse-temurin:17-jre-alpine AS builder

WORKDIR /app
COPY target/courses-0.0.1-SNAPSHOT.jar app.jar

RUN java -Djarmode=layertools -jar app.jar extract


# ---------- STAGE 2: final image ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

EXPOSE 8081

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]