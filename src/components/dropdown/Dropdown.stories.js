import DdDropdown from "./index.vue";
import { ref } from "vue";
// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: "Atoms/Dropdown",
  component: DdDropdown,
};

export const Default = {
  render: (args) => ({
    components: {
      DdDropdown,
    },
    setup() {
      const onClickMethod = () => action("clicked");
      const selected = ref("");
      const value = ref([
        {
          name: "DropDown Menu 1",
          value: 1,
        },
        {
          name: "DropDown Menu 2",
          value: 2,
        },
        {
          name: "DropDown Menu 3",
          value: 3,
        },
        {
          name: "DropDown Menu 4",
          value: 4,
        },
      ]);
      return { value, selected, args, onClickMethod };
    },
    template: `<dd-dropdown v-model="selected"  :options="value" />  `,
  }),
  argTypes: {
    title: {
      description:
        "Change title value as per the requirement or you can use the slot to customize your title",
      table: {
        defaultValue: {
          summary: "''",
        },
      },
    },
    options: {
      description: `Pass data array in options sample = [
        {
          name: "DropDown Menu 1",
          value: 1,
        },
        {
          name: "DropDown Menu 2",
          value: 2,
        },
        {
          name: "DropDown Menu 3",
          value: 3,
        },
        {
          name: "DropDown Menu 4",
          value: 4,
        },
      ]`,
      table: {
        defaultValue: {
          summary: "null",
        },
      },
    },
    type: {
      control: { type: "select" },
      options: ["button", "text"],
      description: "Accepted value button / text",
      table: {
        defaultValue: {
          summary: "text",
        },
      },
    },
    placement: {
      control: { type: "select" },
      options: ["right", "left"],
      description: "You can chnage the position of dropdown menu ",
      table: {
        defaultValue: {
          summary: "right",
        },
      },
    },
    color: {
      control: { type: "select" },
      options: ["primary", "danger", "white"],
      description:
        "You can chnage the color of button primary / danger / white",
      table: {
        defaultValue: {
          summary: "default",
        },
      },
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "base", "lg", "xl"],
      description: "Accepted value xs / sm / base / lg / xl ",
      table: {
        defaultValue: {
          summary: "base",
        },
      },
    },
  },
};

export const Primary = {
  render: (args) => ({
    components: {
      DdDropdown,
    },
    setup() {
      const onClickMethod = () => action("clicked");
      const selected = ref("");
      const value = ref([
        {
          name: "DropDown Menu 1",
          value: 1,
        },
        {
          name: "DropDown Menu 2",
          value: 2,
        },
        {
          name: "DropDown Menu 3",
          value: 3,
        },
        {
          name: "DropDown Menu 4",
          value: 4,
        },
      ]);
      return { value, selected, args, onClickMethod };
    },
    template: `<dd-dropdown v-model="selected"  :options="value" title="Drop Down" color="primary" />  `,
  }),
  argTypes: {
    title: {
      description:
        "Change title value as per the requirement or you can use the slot to customize your title",
      table: {
        defaultValue: {
          summary: "''",
        },
      },
    },
    options: {
      description: "Pass data array in options",
      table: {
        defaultValue: {
          summary: "null",
        },
      },
    },
    type: {
      control: { type: "select" },
      options: ["button", "text"],
      description: "Accepted value button / text",
      table: {
        defaultValue: {
          summary: "text",
        },
      },
    },
    placement: {
      control: { type: "select" },
      options: ["right", "left"],
      description: "You can chnage the position of dropdown menu ",
      table: {
        defaultValue: {
          summary: "right",
        },
      },
    },
    color: {
      control: { type: "select" },
      options: ["primary", "danger", "white"],
      description:
        "You can chnage the color of button primary / danger / white",
      table: {
        defaultValue: {
          summary: "default",
        },
      },
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "base", "lg", "xl"],
      description: "Accepted value xs / sm / base / lg / xl ",
      table: {
        defaultValue: {
          summary: "base",
        },
      },
    },
  },
};

Default.parameters = {
  docs: {
    source: {
      code: `<dd-dropdown v-model="selected"  :options="value" /> `,
    },
  },
};
Primary.parameters = {
  docs: {
    source: {
      code: `<dd-dropdown v-model="selected"  :options="value" title="Drop Down" color="primary" /> `,
    },
  },
};
