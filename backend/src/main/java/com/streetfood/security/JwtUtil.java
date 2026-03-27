package com.streetfood.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    private static final long EXPIRY=1000L*60*60*24*7;
    private SecretKey getKey(){return Keys.hmacShaKeyFor(secret.getBytes());}
    public String generateToken(String email,String role){
        return Jwts.builder().setSubject(email).claim("role",role)
            .setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis()+EXPIRY))
            .signWith(getKey(),SignatureAlgorithm.HS256).compact();
    }
    public String extractEmail(String t){return getClaims(t).getSubject();}
    public String extractRole(String t){return getClaims(t).get("role",String.class);}
    public boolean isTokenValid(String t){try{return !getClaims(t).getExpiration().before(new Date());}catch(Exception e){return false;}}
    private Claims getClaims(String t){return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(t).getBody();}
}