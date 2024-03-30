import { ProfilerOnRenderCallback } from 'react';

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
) => {
    console.log(`id=${id}, phase=${phase}, actualDuration=${actualDuration}[ms], baseDuration=${baseDuration}[ms], startTime=${startTime}, commitTime=${commitTime}`);
}
