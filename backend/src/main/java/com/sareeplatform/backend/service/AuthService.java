package com.sareeplatform.backend.service;

import com.sareeplatform.backend.dto.request.LoginRequest;
import com.sareeplatform.backend.dto.request.RegisterRequest;
import com.sareeplatform.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
