# ---------- Build Stage ----------
FROM maven:3.9.11-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline

COPY src src

RUN ./mvnw clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-Xms64m","-Xmx256m","-XX:MaxMetaspaceSize=128m","-XX:ReservedCodeCacheSize=64m","-Xss512k","-XX:MaxDirectMemorySize=32m","-jar","app.jar"]
