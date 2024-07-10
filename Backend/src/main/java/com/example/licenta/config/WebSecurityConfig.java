package com.example.licenta.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    protected void configure(final HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/users/login").permitAll()
                .antMatchers("/users/**").permitAll()
                .antMatchers("users/change-password").permitAll()
                .antMatchers("api/profesori/changePhoto/").permitAll()
                .antMatchers("api/elevi/changePhoto/").permitAll()
                .antMatchers("api/chat/**").permitAll()
                .antMatchers("api/socket/**").permitAll();



    }
}
