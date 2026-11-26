/*package com.komal.taskmanager.repository;

public class TaskRepository {
    
}
*/

package com.komal.taskmanager.repository;

import com.komal.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

}