package ma.shop.shop;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.net.UnknownHostException;
import java.net.InetAddress;
@SpringBootApplication
public class ShopApplication {
    @Value("${server.port}")
    private String serverPort;

    public static void main(String[] args) {
        SpringApplication.run(ShopApplication.class, args);
    }

    @Bean
    public ApplicationRunner applicationRunner() {
        return args -> {
            logServerDetails();
        };
    }
    private void logServerDetails() throws UnknownHostException{
        InetAddress localhost = InetAddress.getLocalHost();
        String localIpAddress = localhost.getHostAddress();

        System.out.println("Server is running on:");
        System.out.println("Localhost: http://localhost:" + serverPort);
        System.out.println("Local IP Address: http://" + localIpAddress + ":" + serverPort);
    }

}
