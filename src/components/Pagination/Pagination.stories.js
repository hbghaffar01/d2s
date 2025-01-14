import DdPagination from "./index.vue";

export default {
  title: "Atoms/Pagination",
  component: DdPagination,
  argTypes: {
    count: {
      control: { type: "number" },
      description: "The total number of items.",
    },
    limit: {
      control: { type: "number" },
      description: "The number of items per page.",
    },
    offset: {
      control: { type: "number" },
      description: "The current page offset.",
    },
    "fetch-data": {
      action: "fetch-data",
      description:
        "This is a function that is called when new data needs to be fetched.",
      table: {
        type: {
          summary: "function",
        },
      },
    },
  },
};

export const Default = {
  render: (args) => ({
    components: {
      DdPagination,
    },
    setup() {
      return {
        args,
      };
    },
    template: ` <DdPagination
      :count="100"
      :limit="10"
      :offset="offset"
      @fetch-data="getData"
    />`,
  }),
  args: {
    count: 100,
    limit: 10,
    offset: 0,
  },
};

Default.parameters = {
  docs: {
    source: {
      code: ` 
      <DdPagination
      :count="100"
      :limit="10"
      :offset="0"
      @fetch-data="getData"
    />`,
    },
  },
};
