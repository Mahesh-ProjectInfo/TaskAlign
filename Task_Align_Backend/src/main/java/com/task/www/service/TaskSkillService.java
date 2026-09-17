package com.task.www.service;

import java.util.List;

import com.task.www.dto.AddTaskSkillsRequest;
import com.task.www.dto.TaskSkillResponse;

import com.task.www.dto.UpdateTaskSkillsRequest;

import com.task.www.dto.RemoveTaskSkillsRequest;

public interface TaskSkillService {

    List<TaskSkillResponse> addSkillsToTask(Long taskId, AddTaskSkillsRequest request);

    List<TaskSkillResponse> getSkillsByTaskId(Long taskId);

    List<TaskSkillResponse> updateTaskSkills(Long taskId, UpdateTaskSkillsRequest request);

    List<TaskSkillResponse> removeSkillsFromTask(Long taskId, RemoveTaskSkillsRequest request);
}
