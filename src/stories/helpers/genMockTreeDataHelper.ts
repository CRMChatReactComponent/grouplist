import {
  GroupListDataItemType,
  GroupListDataType,
} from "../../components/GroupList/types";
import { GroupItemTypeEnum } from "../../enums";
import { faker } from "@faker-js/faker";

const MAX_CHILDREN_SIZE = 10;
const MAX_DEPTH = 4;

export function genMockTreeData() {
  const tree: GroupListDataType = {
    root: {
      isFolder: true,
      index: "root",
      children: [],
      data: {
        id: "root",
        type: GroupItemTypeEnum.GROUP,
        title: "root group",
        emoji: undefined,
        message: "",
        avatar: undefined,
        backgroundColor: undefined,
        readonly: false,
      },
    },
  };

  const childrenSize = faker.number.int({ min: 2, max: MAX_CHILDREN_SIZE });

  genItem(tree, "root", 1);

  return tree;
}

function genItem(tree: GroupListDataType, parentId: string, depth: number) {
  const childrenSize = faker.number.int({ min: 2, max: MAX_CHILDREN_SIZE });

  for (let i = 0; i < childrenSize; i++) {
    const isFolder = depth >= MAX_DEPTH ? false : faker.datatype.boolean();
    const id = faker.string.uuid();
    const isHaveBackground = faker.datatype.boolean();
    const item: GroupListDataItemType = {
      isFolder,
      index: id,
      children: [],
      data: {
        id: id,
        type: isFolder ? GroupItemTypeEnum.GROUP : GroupItemTypeEnum.USER,
        title: `${depth}__${faker.commerce.productName()}`,
        emoji: undefined,
        message: faker.commerce.productDescription(),
        avatar: isFolder ? undefined : faker.image.avatarGitHub(),
        backgroundColor: isHaveBackground
          ? faker.color.rgb({ prefix: "#" })
          : undefined,
        readonly: false,
      },
    };

    tree[parentId]?.children?.push(id);
    tree[id] = item;

    if (isFolder) {
      genItem(tree, id, depth + 1);
    }
  }
}
