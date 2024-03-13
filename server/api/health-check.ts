export default defineEventHandler(() => {
  // THIS API will be called by ECS load balancer for scaling
  return {
    status: 200,
  };
});
