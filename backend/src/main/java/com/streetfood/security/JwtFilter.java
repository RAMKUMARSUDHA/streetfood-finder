package com.streetfood.security;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
@Component @RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    @Override
    protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain) throws ServletException,IOException {
        String header=req.getHeader("Authorization");
        if(header!=null&&header.startsWith("Bearer ")){
            try{
                String token=header.substring(7);
                String email=jwtUtil.extractEmail(token);
                String role=jwtUtil.extractRole(token);
                if(email!=null&&SecurityContextHolder.getContext().getAuthentication()==null&&jwtUtil.isTokenValid(token)){
                    String springRole=role.startsWith("ROLE_")?role:"ROLE_"+role;
                    var auth=new UsernamePasswordAuthenticationToken(email,null,List.of(new SimpleGrantedAuthority(springRole)));
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }catch(Exception e){System.out.println("JWT error: "+e.getMessage());}
        }
        chain.doFilter(req,res);
    }
}
