import { Node, FlowPort, NodeParams, FallbackPort, filterCallback, restoreCallback, getFieldValue } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';

const OnEventMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(55)
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='On Event' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Event Path', field: 'param-4', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'From', field: 'param-5', type: 'input' }]} />
            <div style={{ paddingBottom: "26px" }}>
                <FlowPort id={node.id} type='input' label='On Event (event)' style={{ top: '95px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param-3'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async (event) => " postText="" />
            </div>
        </Node>
    )
}

//context, cb, path?, from?

export default {
    id: 'onEventMask',
    type: 'CallExpression',
    category: "automation",
    keywords: ["automation", 'trigger', 'on event'],
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression" &&
            nodeData.to == 'context.events.onEvent' &&
            (getFieldValue('param-3', nodeData)?.startsWith('(event) =>') ||
                getFieldValue('param-3', nodeData)?.startsWith('async (event) =>')) &&
            getFieldValue('param-5', nodeData) != "device"
        );
    },
    getComponent: (node, nodeData, children) => (
        <OnEventMask node={node} nodeData={nodeData} children={children} />
    ),
    getInitialData: () => {
        return {
            to: 'context.events.onEvent',
            "param-1": { value: 'context.mqtt', kind: "Identifier" },
            "param-2": { value: 'context', kind: "Identifier" },
            "param-3": { value: 'async (event) =>', kind: "Identifier" },
            "param-4": { value: "", kind: "StringLiteral" },
            "param-5": { value: '', kind: "StringLiteral" }
        };
    },
    filterChildren: filterCallback('3'),
    restoreChildren: restoreCallback('3'),
}