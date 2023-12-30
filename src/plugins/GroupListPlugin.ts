import { GroupListPropsType } from "@/components/GroupList";
import { PluginType } from "@/types";

export class GroupListPlugin {
  private plugins: Record<string, PluginType> = {};

  public register(plugin: PluginType) {
    if (this.plugins[plugin.name]) {
      console.warn(`[${plugin.name}] already installed!`);
    }
    this.plugins[plugin.name] = plugin;
  }

  /**
   * 处理插件处理后的 props
   * @param props
   */
  resolveProps(props: GroupListPropsType): GroupListPropsType {
    Object.values(this.plugins)
      .sort((a, b) => {
        //  值越大，优先级越靠前
        return (b.priority ?? 0) - (a.priority ?? 0);
      })
      .map((plugin) => {
        if (plugin.resolveProps) {
          props = plugin.resolveProps(props);
        }
      });

    return props;
  }
}
