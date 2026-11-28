/*package com.komal.taskmanager.repository;

public class UserRepository {
    
}
*/

package com.komal.taskmanager.repository;

import com.komal.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}