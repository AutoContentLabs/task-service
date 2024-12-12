/**
 * Pipeline Example
 * @file pipeline.js
 */
module.exports = {
    name: "auto-lab",
    description: `Automated pipeline for content creation based on real-time trends analysis.`,
    type: "PIPELINE",
    state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
    status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
    dependencies: [],
    on_start: [
        {
            type: "config",
            name: "initialConfiguration",
            parameters: {
                checkpoint: true, // Enable checkpointing for task consistency
                state: true, // Enable state tracking
                parallel: true, // Enable parallel processing within the pipeline
                schedule: "0 * * * *", // Cron job: run every hour
                timeout: 120, // Set maximum allowed runtime for each task
                retries: 3, // Number of retries in case of task failure
            },
            // timestamp // Timestamp when the pipeline started,
        },
    ],
    on_failure: [
        {
            type: "function",
            name: "handle_pipeline_failure",
            // timestamp // Timestamp when the pipeline failure
        },
    ],
    on_success: [
        {
            type: "status",
            name: "completed",
            // timestamp // Timestamp when the pipeline completed
        },
    ],
    steps: [
        {
            name: "dataPreprocessing",
            description: `Retrieve and process data from multiple sources for initial analysis`,
            type: "WORKFLOW",
            state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
            status: "PENDING", // 'PENDING', 'RUNNING', 'SUCCESS', 'FAILED'
            dependencies: [],
            on_start: [
                {
                    type: "config",
                    name: "workflowConfiguration",
                    parameters: {
                        checkpoint: true, // Enable checkpointing
                        state: true, // Enable state tracking
                        parallel: true, // Enable parallel execution of steps
                        timeout: 60, // Maximum allowed time for this task
                        retries: 2, // Retry the task up to 2 times on failure
                    },
                    // timestamp // Timestamp when the workflow started,
                },
            ],
            on_failure: [
                {
                    type: "function",
                    name: "handle_workflow_failure",
                    // timestamp // Timestamp when the workflow failure
                },
            ],
            on_success: [
                {
                    type: "status",
                    name: "completed",
                    // timestamp // Timestamp when the workflow completed
                },
            ],
            steps: [
                {
                    name: "loadDataSources",
                    description: `Request data from external services and load them into the system`,
                    type: "task",
                    state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
                    status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
                    dependencies: [],
                    on_start: [
                        {
                            type: "service",
                            name: "data_source_service",
                            parameters: {
                                checkpoint: true,
                                state: true,
                                parallel: true,
                                timeout: 30,
                                retries: 3,
                            },
                            input: {
                                storage: {
                                    database: "mysql",
                                    collection: "service_data",
                                    flow: "incoming",
                                },
                            },
                            output: {
                                format: "json",
                                data: [],
                            },
                        },
                    ],
                    on_failure: [
                        {
                            type: "function",
                            name: "handle_task_failure",
                        },
                    ],
                    on_success: [
                        {
                            type: "step",
                            name: "processData",
                        },
                    ],
                },
                {
                    name: "processData",
                    description: `Process the loaded data and prepare it for further analysis`,
                    type: "task",
                    state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
                    status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
                    dependencies: [
                        {
                            type: "step",
                            name: "loadDataSources",
                        },
                    ],
                    on_start: [
                        {
                            type: "service",
                            name: "data-processor-service",
                            parameters: {
                                parallel: false,
                                timeout: 45,
                                retries: 2,
                            },
                            input: {
                                storage: {
                                    database: "mongodb",
                                    collection: "processed_data",
                                    flow: "outgoing",
                                },
                            },
                            output: {
                                format: "json",
                                data: [],
                            },
                        },
                    ],
                    on_failure: [
                        {
                            type: "function",
                            name: "handleTaskFailure",
                        },
                    ],
                    on_success: [
                        {
                            type: "step",
                            name: "generateContent",
                        },
                    ],
                },
            ],
        },
        {
            name: "generateContent",
            description: `Generate content (video and articles) based on processed data and trends`,
            type: "workflow",
            state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
            status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
            dependencies: [],
            on_start: [
                {
                    type: "config",
                    name: "contentGenerationConfig",
                    parameters: {
                        parallel: true,
                        timeout: 90,
                        retries: 3,
                    },
                },
            ],
            on_failure: [
                {
                    type: "function",
                    name: "handle_workflow_failure",
                },
            ],
            on_success: [
                {
                    type: "status",
                    name: "completed",
                },
            ],
            steps: [
                {
                    name: "createArticle",
                    description: `Generate an article based on the data analysis`,
                    type: "task",
                    state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
                    status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
                    dependencies: [],
                    on_start: [
                        {
                            type: "service",
                            name: "content_creator_service",
                            parameters: {
                                parallel: false,
                                timeout: 45,
                                retries: 2,
                            },
                            input: {
                                storage: {
                                    database: "postgresql",
                                    collection: "articles_data",
                                    flow: "outgoing",
                                },
                            },
                            output: {
                                format: "text",
                                data: [],
                            },
                        },
                    ],
                    on_failure: [
                        {
                            type: "function",
                            name: "handle_task_failure",
                        },
                    ],
                    on_success: [
                        {
                            type: "step",
                            name: "generateVideo",
                        },
                    ],
                },
                {
                    name: "generateVideo",
                    description: `Generate a video based on the content analysis`,
                    type: "task",
                    state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
                    status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
                    dependencies: [
                        {
                            type: "step",
                            name: "createArticle",
                        },
                    ],
                    on_start: [
                        {
                            type: "service",
                            name: "video_generator_service",
                            parameters: {
                                parallel: false,
                                timeout: 60,
                                retries: 2,
                            },
                            input: {
                                storage: {
                                    database: "mongodb",
                                    collection: "videos_data",
                                    flow: "outgoing",
                                },
                            },
                            output: {
                                format: "video",
                                data: [],
                            },
                        },
                    ],
                    on_failure: [
                        {
                            type: "function",
                            name: "handle_task_failure",
                        },
                    ],
                    on_success: [
                        {
                            type: "step",
                            name: "publishContent",
                        },
                    ],
                },
            ],
        },
        {
            name: "publishContent",
            description: `Publish the generated content to social media platforms`,
            type: "workflow",
            state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
            status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
            dependencies: [],
            on_start: [
                {
                    type: "config",
                    name: "publish_config",
                    parameters: {
                        parallel: true,
                        timeout: 120,
                        retries: 2,
                    },
                },
            ],
            on_failure: [
                {
                    type: "function",
                    name: "handle_workflow_failure",
                },
            ],
            on_success: [
                {
                    type: "status",
                    name: "completed",
                },
            ],
            steps: [
                {
                    name: "shareOnSocialMedia",
                    description: `Share generated article and video on social media platforms`,
                    type: "task",
                    state: "IDLE", // 'IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
                    status: "IDLE", // 'IDLE', 'RUNNING', 'COMPLETED', 'FAILED'
                    dependencies: [],
                    on_start: [
                        {
                            type: "service",
                            name: "social_media_service",
                            parameters: {
                                parallel: true,
                                timeout: 45,
                                retries: 2,
                            },
                        },
                    ],
                    on_failure: [
                        {
                            type: "function",
                            name: "handle_task_failure",
                        },
                    ],
                    on_success: [
                        {
                            type: "status",
                            name: "published",
                        },
                    ],
                },
            ],
        },
    ],
};
