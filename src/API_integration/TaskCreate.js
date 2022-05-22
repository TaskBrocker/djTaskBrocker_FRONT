export default async function TaskCreate(inData) {

    return await fetch("/tb/api/create-task-interval", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: inData.name,
          id_name: inData.id_name,
          trigger_interval_weeks: inData.trigger_interval_weeks,
          trigger_interval_days: inData.trigger_interval_days,
          trigger_interval_hours: inData.trigger_interval_hours,
          trigger_interval_minutes: inData.trigger_interval_minutes,
          trigger_interval_seconds: inData.trigger_interval_seconds,
          task_app_name: inData.task_app_name,
          task_module_name: inData.task_module_name,
          task_function_name: inData.task_function_name,
        })
      });
}