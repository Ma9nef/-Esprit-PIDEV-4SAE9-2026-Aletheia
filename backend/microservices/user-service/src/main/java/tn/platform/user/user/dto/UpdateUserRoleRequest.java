package tn.platform.user.user.dto;

import lombok.Data;
import tn.platform.user.user.entity.Role;

@Data
public class UpdateUserRoleRequest {
    private Long userId;
    private Role role;
}
