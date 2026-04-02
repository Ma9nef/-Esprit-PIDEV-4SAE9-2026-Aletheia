package tn.platform.user.user.dto;

import lombok.Data;

@Data

public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
