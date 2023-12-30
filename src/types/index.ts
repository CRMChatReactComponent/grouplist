import { GroupListPropsType } from "@/components/GroupList";

export type CancelableReturnType = void | false | Promise<void | false>;

export type UnSettable<T> = T | undefined;
export type US<T> = UnSettable<T>;

export type PluginType = {
  name: string;
  //  执行优先级，值越大，优先级越大
  priority?: number;

  //  处理 GroupList props
  resolveProps?: (props: GroupListPropsType) => GroupListPropsType;
};
