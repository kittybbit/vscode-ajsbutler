import { Node, Edge, MarkerType } from "@xyflow/react";
import { TySymbol } from "../../../domain/values/AjsType";
import { UnitEntity } from "../../../domain/models/units/UnitEntities";
import { Theme } from "@mui/material";

// convert ty to ReactFlow type.
const ty2Type = (ty: TySymbol) => {
    if (['g'].includes(ty)) {
        return 'jobgroup';
    }
    if (['n', 'rn', 'rm', 'rr'].includes(ty)) {
        return 'jobnet';
    }
    if (['rc'].includes(ty)) {
        return 'condition';
    }
    return 'job';
};

const calcPosition = (unitEntity: UnitEntity, theme: Theme) => {
    const { h, v } = unitEntity.hv;
    const basePx = theme.typography.htmlFontSize;
    const width = basePx * 6; // 6rem
    const height = basePx * 6; // 6rem
    const marginX = width / 4;
    const marginY = height / 4;
    const offsetX = width / 3;
    const offsetY = height * 2;

    return {
        x: offsetX + (width + marginX) * ((h - 80) / 160 - 1),
        y: offsetY + (height + marginY) * ((v - 48) / 96),
    };
};
const calcAncestorPosition = (unitEntity: UnitEntity, theme: Theme) => {
    const basePx = theme.typography.htmlFontSize;
    const width = basePx * 6; // 6rem
    const hight = basePx * 6; // 6rem
    const marginX = width / 5;
    const offsetX = width / 3;
    const offsetY = hight / 2;
    return {
        x: offsetX + (width + marginX) * unitEntity.depth,
        y: offsetY,
    }
};

/** create React flow items from unitEntity. */
export const createReactFlowData = (unitEntity: UnitEntity, theme: Theme) => {
    const nodes: Node[] = unitEntity.children
        .filter((child) => child.ty.value() !== 'rc')
        .map((child) => {
            return {
                id: child.id,
                type: ty2Type(child.ty.value()),
                data: {
                    label: child.name,
                    unitEntity: child,
                },
                position: calcPosition(child, theme),
            }
        });
    const ancestors = [...unitEntity.ancestors, unitEntity, unitEntity.children.find(v => v.ty.value() === 'rc')]
        .filter(v => v !== undefined)
        .map((ancestor) => {
            return {
                id: ancestor.id,
                type: ty2Type(ancestor.ty.value()),
                data: {
                    label: ancestor.name,
                    unitEntity: ancestor,
                },
                position: calcAncestorPosition(ancestor, theme),
            }
        });
    nodes.push(...ancestors);
    console.log(JSON.stringify(nodes, null, 2));
    const edges: Edge[] = unitEntity.children
        .filter((child) => child.nextUnits.length > 0)
        .map((source) => {
            return source.nextUnits
                .filter((target) => target.unitEntity !== undefined)
                .map((target) => {
                    return {
                        type: 'smoothstep',
                        id: `${source.id}-${target.unitEntity?.id}`,
                        source: source.id,
                        target: target.unitEntity?.id as string,
                        markerStart: target.relationType === 'con'
                            ? {
                                type: MarkerType.ArrowClosed,
                                width: 20,
                                height: 20,
                            }
                            : undefined,
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            width: 20,
                            height: 20,
                        },
                        animated: target.relationType === 'con',
                    }
                });
        })
        .flat();
    console.log(JSON.stringify(edges, null, 2));
    return { nodes: nodes, edges: edges };
};