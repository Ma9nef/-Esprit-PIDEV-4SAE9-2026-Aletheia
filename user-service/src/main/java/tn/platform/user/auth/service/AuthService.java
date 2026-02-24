package tn.platform.user.auth.service;

import tn.platform.user.auth.dto.AuthResponse;
import tn.platform.user.auth.dto.LoginRequest;
import tn.platform.user.auth.dto.RegisterRequest;
import tn.platform.user.auth.dto.*;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
