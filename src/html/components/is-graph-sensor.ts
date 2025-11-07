/**
 * Checks if an entity is a CPU or memory usage sensor that should be displayed in a graph
 * @param entityId - The entity ID to check
 * @returns True if the entity should be displayed in a graph
 */
export const isGraphSensor = (entityId: string): boolean => {
  return (
    entityId === 'sensor.pi_hole_cpu_use' ||
    entityId === 'sensor.pi_hole_memory_use'
  );
};

