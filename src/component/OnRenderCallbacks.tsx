import { ProfilerOnRenderCallback } from 'react';
import { Interaction } from 'scheduler/tracing';

/**
 * @example
 * <Profiler id='id of target' onRender={onRenderCallback}>
 *   {children}
 * </Profiler>
 */
export const onRenderCallback: ProfilerOnRenderCallback = (
    id: string,
    phase: 'mount' | 'update' | "nested-update",
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<Interaction>,
) => {
    console.log(`id=${id}, phase=${phase}, actualDuration=${actualDuration}[ms], baseDuration=${baseDuration}[ms], startTime=${startTime}, commitTime=${commitTime}, interactions=${interactions}`);
}
