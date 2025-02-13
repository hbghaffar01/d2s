<template>
  <div class="dd-grid dd-w-full" v-bind="$attrs">
    <div class="dd-min-w-full dd-align-middle dd-bg-white dd-relative">
      <div :class="[
        !fixedHeight ? '' : getCalculatedHeight,
        !fixed || limit < 1 ? 'empty_state' : 'fixedScroll',
        limit < 1 ? 'dd-overflow-y-hidden' : '',
      ]" ref="containerRef" @scroll="handleScroll">
        <!-- header with group button  -->
        <div v-if="actionHeader"
          class="dd-flex dd-items-center dd-justify-between !dd-w-full group_wrapper !dd-bg-white !dd-z-[1000]"
          :class="[selectedId?.length > 0 ? 'dd-h-[40px]' : '']">
          <div v-if="selectedId?.length > 0"
            class="dd-flex dd-items-center dd-gap-2 dd-py-2 dd-pl-3 dd-pr-3 dd-text-left">
            <DdGroupButton :buttons="buttons">
              <dd-Button type="secondary" v-if="checkBoxProp" size="sm">
                <div class="dd-flex dd-items-center">
                  <dd-checkbox v-model="allSelected" @click="selectAllFields" :disabled="checkAllDisabled || limit < 1"
                    :rows="rows" @indeterminate="indeterminate" :allCheckboxesChecked="allCheckboxesChecked"
                    :selectedId="selectedId" />
                  <span class="dd-text-sm dd-font-medium dd-text-gray-700 dd-pl-2" :disabled="buttons?.disabled">{{
                    selectedId.length }} Selected</span>
                </div>
              </dd-Button>
              <dd-Button type="secondary" :disabled="buttons?.disabled" size="sm">
                <div class="dd-flex dd-items-center dd-gap-2">
                  <svgIcon type="secondary" icon="Printer" size="16" />
                  <span class="dd-text-sm dd-font-medium dd-text-gray-700">Print</span>
                </div>
              </dd-Button>
              <dd-Button type="secondary" :disabled="buttons?.disabled" size="sm">
                <div class="dd-flex dd-items-center dd-gap-2">
                  <svgIcon type="secondary" icon="Printer" size="16" />
                  <span class="dd-text-sm dd-font-medium dd-text-gray-700">Print</span>
                </div>
              </dd-Button>
              <slot name="groupActions" />
            </DdGroupButton>
            <DdDropDown v-if="actionsPanel" type="secondary" label="Actions" v-model="headerActions" :options="values"
              size="sm" :showIcon="showIcon" @command="getHeaderDropdownVal" />
            <slot name="customDropDown" />
          </div>
          <svgIcon v-if="actionHeader && !search && searchIcon" class="!dd-text-gray-500 dd-absolute dd-right-6"
            :class="[selectedId.length === 0 ? 'dd-hidden' : '']" :icon="selectedId.length > 0 ? 'Search' : 'none'"
            size="20" @click="openSearch" />

          <div class="dd-w-full dd-cursor-pointer" v-if="search && searchIcon">
            <div class="dd-flex dd-items-center dd-gap-3">
              <svgIcon v-if="selectedId?.length > 0" icon="Search" size="20" class="dd-text-gray-400" />
              <dd-input type="text" v-model="queryInput" @change="searchQuery"
                class="focus-visible:!dd-border-none dd-w-full" :icon="selectedId?.length === 0 ? 'Search' : ''"
                Border="none" placeholder="Search Ticket" size="xl" :prefix="selectedId?.length === 0 ? true : false" />
            </div>
            <svgIcon icon="Close" size="20" class="dd-absolute dd-text-gray-400 dd-top-3 hover:dd-text-gray-500"
              @click="closeSearch" :class="[fixed ? 'dd-right-6' : 'dd-right-6']" />
          </div>
        </div>
        <div class="dd-w-full dd-cursor-pointer" v-if="search && !actionHeader && searchIcon"
          :class="[fixed ? 'group_wrapper' : '']">
          <dd-input type="text" v-model="queryInput" @change="searchQuery" class="focus-visible:!dd-border-none"
            :icon="selectedId?.length === 0 ? 'Search' : ''" Border="none" placeholder="Search Ticket"
            :size="selectedId?.length > 0 ? 'lg' : 'xl'" :prefix="selectedId?.length === 0 ? true : false" />
          <svgIcon icon="Close" size="12" class="dd-absolute dd-text-gray-400 dd-top-4 hover:dd-text-gray-500"
            @click="closeSearch" :class="[fixed ? 'dd-right-6' : 'dd-right-6']" />
        </div>
        <slot name="actionHeaderSlot" />
        <table class="dd-w-full dd-overflow-y-auto" :class="selectedId.length > 0 && actionHeader == true
          ? '!dd-border-t dd-border-gray-200'
          : '!dd-border-0'
          ">
          <!-- tabel head  -->
          <thead class="!dd-sticky !dd-top-0 !dd-bg-white !dd-z-[1000]" v-if="setTableHeader"
            :class="[limit > 1 ? 'dd-cursor-pointer' : '']">
            <tr class="dd-bg-white">
              <th
                class="dd-py-2 !dd-pl-5 dd-text-left checkbox_wrapper !dd-leading-3 dd-h-[40px] table_head_row dd-sticky dd-top-0"
                :class="[!search ? 'table_border' : '']" v-if="checkBoxProp">
                <dd-checkbox v-model="allSelected" @click="selectAllFields" :disabled="checkAllDisabled || limit < 1"
                  :rows="rows" @indeterminate="indeterminate" :allCheckboxesChecked="allCheckboxesChecked"
                  :selectedId="selectedId" />
              </th>
              <slot name="th" />

              <th v-for="col in columns" :key="col?.value" :value="col" scope="col" v-show="col?.checked"
                class="dd-py-2 dd-text-left dd-text-xs dd-font-medium dd-text-gray-500 !dd-leading-3 dd-h-[41px] table_head_row dd-sticky dd-top-0"
                :style="`min-width: ${col?.size}px`" @mouseenter="handleMouseEnter(col)" @mouseleave="handleMouseLeave"
                @click="sortRows(col)"
                :class="[checkBoxProp ? 'dd-pl-3 dd-pr-3' : 'dd-pl-5', !search ? 'table_border' : '']">
                <div :class="[sortIcon ? 'dd-flex dd-gap-1.5 dd-w-fit' : 'dd-w-fit']">
                  <slot name="thead" :col="col">
                    <span class="dd-text-xs">{{ col?.title }}</span>
                  </slot>
                  <div v-if="sortIcon">
                    <svgIcon class="!dd-text-gray-500 dd-relative dd-top-[3px]" icon="Selector" size="10" v-show="isHovered(col) && !limit < 1 && col?.sortDirection === ''
                      " :disabled="col?.disabled || limit < 1" v-if="limit" />
                    <svgIcon class="!dd-text-gray-500 dd-relative dd-top-[3px]" icon="SelectorUp" size="10"
                      v-show="col?.sortDirection === 'desc'" @click="sortRows(col)" v-if="limit" />
                    <svgIcon class="!dd-text-gray-500 dd-relative dd-top-[3px]" icon="SelectorDown" size="10"
                      v-show="col?.sortDirection === 'asc'" @click="sortRows(col)" v-if="limit" />
                  </div>
                </div>
              </th>

              <th class="table_head_row dd-sticky dd-top-0" :class="[!search ? 'table_border' : '']" v-if="lastCell">
                <div
                  class="dd-flex dd-items-center dd-justify-end dd-gap-4 dd-relative dd-right-5 !dd-z-[999] dd-bg-white dd-pl-2.5">
                  <svgIcon v-if="searchIcon" class="!dd-text-gray-500" icon="Search" size="20" @click="openSearch" />
                  <svgIcon v-if="settingbarIcon" ref="settingIcon" class="!dd-text-gray-500" icon="Settings" size="20"
                    @click="openSettingsBar" />
                </div>
                <!-- settings component  -->
                <div v-if="setting && lastCell" ref="settingElement"
                  class="dd-pr-2 dd-pt-2 dd-w-[250px] dd-bg-white dd-container dd-my-[2.1rem] dd-absolute dd-right-4 dd-top-1 dd-shadow-xl dd-rounded-lg dd-border dd-border-gray-100"
                  style="z-index: 1100;">
                  <draggable tag="ul" v-model="modelColumn" class="dd-text-left" handle=".handle" item-key="name"
                    drag-class="drag-class" ghost-class="ghost-class" @change="watchState">
                    <template #item="{ element }">
                      <li class="dd-flex dd-items-center dd-justify-between" @mouseenter="showIcon(element)"
                        @mouseleave="hideIcon(element)">
                        <div class="dd-flex dd-items-center" v-if="element?.disabled === false">
                          <div class="dd-w-4">
                            <svgIcon :disabled="element?.disabled" v-show="dragDrop"
                              class="!dd-text-gray-500 handle dd-relative dd-top-[3px]"
                              :class="[element.disabled ? 'dd-hidden' : 'dd-cursor-move', { 'dd-hidden': !element.hovered }]"
                              icon="GripVerticle" size="16" />
                          </div>
                          <dd-Checkbox v-model="element.checked" @click="setSetting(element.checked)"
                            :disabled="element.disabled" class="dd-mb-[2px]" />
                          <span class="dd-text-gray-700 dd-text-sm dd-ml-2 dd-font-normal">{{ element.title }}</span>
                        </div>
                        <div class="dd-w-16 dd-mr-2" v-if="element?.disabled === false">
                          <dd-input Right v-model="element.size" type="text" pattern="[0-9]*" :disabled="element.disabled"
                            class="focus-visible:!dd-border-none dd-my-1" size="xs" />
                        </div>
                      </li>
                    </template>
                  </draggable>
                  <div class="dd-flex dd-items-center dd-justify-end dd-gap-3 dd-my-2 dd-mr-2">
                    <dd-Button type="tertiary"
                      class="[&>button]: dd-ring-0 [&>button]: dd-ring-transparent [&>button]: dd-shadow-none [&>button]: dd-text-teal-600 [&>button]: hover:dd-bg-white [&>button]: dd-font-light dd-cursor-pointer"
                      @click="resetDefault()">
                      Reset
                    </dd-Button>
                    <dd-Button class="[&>button]: dd-font-normal" @click="saveSettings()">
                      Save
                    </dd-Button>
                  </div>
                </div>
              </th>
              <slot name="headerActions" />
            </tr>
          </thead>
          <tbody class="dd-bg-white" v-if="rows.length > 0"
            :class="[search ? '[&>*:first-child]:dd-border-t [&>*:first-child]:dd-border-gray-200 [&>*:first-child]:!dd-border-b-0 [&>*:nth-child(2)]:dd-border-t' : '']">
            <template v-if="!defaultRow">
              <tr v-for="(row, index) in rows" :key="index"
                class="[&>*:nth-child(1)]:!dd-font-normal [&>*:nth-child(2)]:!dd-font-medium dd-relative dd-border-b dd-border-gray-100"
                :class="[
                  selectedId.includes(row?.id)
                    ? '[&>*:nth-child(1)]:!dd-bg-gray-50 [&>*:nth-child(2)]:!dd-bg-gray-50  [&>*:last-child]:!dd-bg-gray-50 !dd-bg-gray-50'
                    : '',
                  row?.disabled
                    ? '[&>*:nth-child(1)]:dd-bg-gray-50 [&>*:nth-child(2)]:dd-bg-gray-50  [&>*:last-child]:dd-bg-gray-50  dd-bg-gray-50 dd-pointer-event-none dd-cursor-not-allowed'
                    : 'dd-cursor-pointer',
                ]" @mouseenter="hoveringRow ? handleMouseEnterActions(row) : null"
                @mouseleave="handleMouseLeaveActions" @click="row?.disabled ? null : clickedRow(row)">
                <td v-if="checkBoxProp" class="dd-py-2.5 dd-pl-5 dd-pr-1 dd-text-xs dd-font-medium dd-text-gray-700">
                  <div class="dd-w-full" :class="[
                    selectedId.includes(row?.id)
                      ? '[&>*:nth-child(1)]:after:!dd-border-l-[3px] [&>*:nth-child(1)]:after:!dd-border-t-gray-200 [&>*:nth-child(1)]:after:!dd-border-b-gray-200 [&>*:nth-child(1)]:after:!dd-border-teal-600 [&>*:nth-child(1)]:after:dd-left-0 [&>*:nth-child(1)]:after:dd-absolute [&>*:nth-child(1)]:after:dd-top-0 [&>*:nth-child(1)]:after:dd-bottom-0'
                      : '',
                  ]">
                    <div class="dd-h-full -dd-my-2.5">
                      <dd-checkbox @click="setChecked(row[rowKey])" :checked="selectedId &&
                        selectedId.includes(row?.id) &&
                        !row?.disabled
                        " :value="row?.id" :disabled="row?.disabled || checkAllDisabled" />
                    </div>
                  </div>
                </td>
                <slot name="td" />
                <td v-for="col in columns" :key="col?.value" v-show="col?.checked"
                  class="dd-whitespace-nowrap dd-py-2.5 dd-pl-3 dd-pr-3 dd-text-sm dd-text-gray-500" :class="[
                    row?.disabled || !checkBoxProp
                      ? '!dd-pl-5'
                      : 'dd-cursor-pointer',
                  ]" :style="`min-width: ${col?.size}px`">
                  <slot name="row" :column="col" :row="row" :value="row[col?.value]" :rowIndex="index" :disabled="row?.disabled">
                    {{ row[col?.value] }}
                  </slot>
                </td>
                <!-- actions  -->
                <td v-if="lastCell" class="dd-pl-9 dd-pr-9 dd-relative dd-max-w-[56px]"
                  :style="`z-index: ${rows.length - index} `" :class="[
                    row?.disabled
                      ? '!dd-pointer-event-none'
                      : 'dd-cursor-pointer',
                  ]">
                  <hoverRow :actionsPanel="actionsPanel" :values="Actions" :rowDisabled="row?.disabled"
                    :selected="selected" :showIcon="showIcon" :hoveredRow="hoveredRow" :presistAction="presistAction" :row="row" @editRow="editRow"
                    @deleteRow="deleteRow" :selectedId="selectedId" @dropdownValue="dropdownValue" />
                  <slot name="rowActions" />
                </td>
              </tr>
            </template>
            <slot name="tbody" />
          </tbody>
          <tbody v-else>
            <tr class="">
              <td :colspan="columns.length + 2" class="dd-h-full hover:!dd-bg-transparent">
                <slot name="noData" />
                <div class="dd-flex dd-items-center dd-justify-center dd-min-h-[60vh]" v-if="emptyState">
                  <svgIcon size="140" type="secondary" icon="noData" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="footer && limit > 1" class="dd-flex dd-items-center dd-justify-between dd-py-3 dd-px-3">
        <DdGroupButton :buttons="buttons">
          <dd-Button v-for="button in buttons" :key="button?.id" type="secondary" :size="button?.size"
            :disabled="button?.disabled"
            class="dd-text-sm [&>span]:!dd-text-gray-500 [&>span]:!dd-font-normal !dd-w-[41px] !dd-p-0 dd-flex dd-items-center dd-justify-center"
            :class="setActiveButton(button?.label)" :loader="button?.loader" :title="button?.label" :type="button?.type"
            :block="button?.block" :icon="button?.icon" :iconSize="button?.iconSize"
            @click="selectNumberOfRows(button)" />
        </DdGroupButton>

        <dd-Button type="secondary" size="sm" v-model="selectedButton" :disable="disabledLoadmore" :loader="loadmoreLoader"
          @click="loadMore()">
          Load More
        </dd-Button>
      </div>
      <div v-else>
        <slot name="footerSlot" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onBeforeMount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import draggable from 'vuedraggable/src/vuedraggable'
import hoverRow from "./hoverRow.vue";
import DdButton from "../buttons/index.vue";
import svgIcon from "../svgIcon/index.vue";
import DdCheckbox from "../checkbox/index.vue";
import DdGroupButton from "../groupButton/index.vue";
import DdDropDown from "../dropdown/index.vue";
import DdInput from "../input/index.vue";
const emits = defineEmits([
  "update:modelValue",
  "saveChanges",
  "resetData",
  "selectedRow",
  "numberOfRow",
  "loadmore",
  "allCheckboxes",
  "searchQuery",
  "editRow",
  "deleteRow",
  "selectedCheckBoxes",
  "sort",
  "dropdownValue",
  "headerDropdown",
  "updateSettings",
]);
const props = defineProps({
  rowKey: {
    type: String,
    default: "id",
  },
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  buttons: {
    type: Array,
    required: true,
  },
  Actions: {
    type: Array,
    required: true,
  },
  values: {
    type: Array,
    required: true,
  },
  fixedHeight: {
    type: Boolean,
    default: false,
  },
  defaultRow: {
    type: Boolean,
    default: false,
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  rowActions: {
    type: Boolean,
    default: true,
  },
  checkBoxProp: {
    type: Boolean,
    default: false,
  },
  actionHeader: {
    type: Boolean,
    default: false,
  },
  checkAllDisabled: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: String,
    default: "",
  },
  headerselectedActions: {
    type: String,
    default: "",
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  emptyState: {
    type: Boolean,
    default: false,
  },
  footer: {
    type: Boolean,
    default: false,
  },
  disabledLoadmore: {
    type: Boolean,
    default: false,
  },
  loadmoreLoader: {
    type: Boolean,
    default: false,
  },
  searchIcon: {
    type: Boolean,
    default: false,
  },
  settingbarIcon: {
    type: Boolean,
    default: false,
  },
  presistAction: {
    type: Boolean,
    default: false,
  },
  lastCell: {
    type: Boolean,
    default: false,
  },
  actionsPanel: {
    type: Boolean,
    default: false,
  },
  limitVal: {
    type: Number,
    default: 0,
  },
  paginationButton: {
    type: String,
    default: "5",
  },
  buttonselected: {
    type: String,
    default: "",
  },
  hoveringRow: {
    type: Boolean,
    default: false,
  },
  sortIcon: {
    type: Boolean,
    default: false,
  },
  dragDrop: {
    type: Boolean,
    default: false,
  },
  defaultProps: {
    type: Object,
    default: () => ({
      name: "name",
      value: "value",
      avatar: "avatar",
    }),
  },
});

const containerRef = ref(null);

const handleScroll = () => {
  const container = containerRef.value;
  const tableHeadCells = container.querySelectorAll(
    ".fixedScroll th:nth-child(1)"
  );
  const tableRowCells = container.querySelectorAll(
    ".fixedScroll td:nth-child(1)"
  );
  const tableCells2 = container.querySelectorAll(
    ".fixedScroll td:nth-child(2)"
  );
  const tableCells2Head = container.querySelectorAll(
    ".fixedScroll th:nth-child(2)"
  );
  const tableHeaderCell = container.querySelectorAll(
    ".fixedScroll .checkbox_wrapper"
  );
  const tableLastCell = container.querySelectorAll(
    ".fixedScroll td:last-child"
  );
  const tableLastHead = container.querySelectorAll(
    ".fixedScroll th:last-child"
  );

  tableHeaderCell.forEach((cell) => {
    if (container.scrollLeft >= 0) {
      cell.classList.add("checkbox_cell_wrapper");
    } else if (container.scrollLeft <= 0) {
      cell.classList.remove("checkbox_cell_wrapper");
    }
  });

  tableHeadCells.forEach((cell) => {
    if (container.scrollLeft >= 0) {
      cell.classList.add("fixed_head_cell_one");
    } else if (container.scrollLeft < 0) {
      cell.classList.remove("fixed_head_cell_one");
    }
  });
  tableRowCells.forEach((cell) => {
    if (container.scrollLeft >= 0) {
      if (props.checkBoxProp == false) {
        cell.style.boxShadow = "-2px 0 2px -2px rgba(0, 0, 0, 0.2) inset";
      }
      cell.classList.add("fixed_cell_one");
    } else if (container.scrollLeft <= 0) {
      cell.classList.remove("fixed_cell_one");
      if (props.checkBoxProp == false) {
        cell.style.boxShadow = "none";
      }
    }
  });

  if (props.checkBoxProp !== false) {
    tableCells2.forEach((cell) => {
      if (container.scrollLeft >= 0) {
        cell.classList.add("fixed_cell_two");
      } else if (container.scrollLeft <= 0) {
        cell.classList.remove("fixed_cell_two");
      }
    });

    tableCells2Head.forEach((cell) => {
      if (container.scrollLeft >= 0) {
        cell.classList.add("fixed_cell_two_head");
      } else if (container.scrollLeft <= 0) {
        cell.classList.remove("fixed_cell_two_head");
      }
    });
  }

  tableLastCell.forEach((cell) => {
    const scrollValueFromRight =
      container.scrollWidth - container.clientWidth - container.scrollLeft;
    if (scrollValueFromRight > -1) {
      cell.classList.add("fixed_last_cell");
    } else if (scrollValueFromRight < -1) {
      cell.classList.remove("fixed_last_cell");
    }
  });

  tableLastHead.forEach((cell) => {
    const scrollValueFromRight =
      container.scrollWidth - container.clientWidth - container.scrollLeft;
    if (scrollValueFromRight > 0) {
      cell.classList.add("fixed_last_cell_head");
    } else if (scrollValueFromRight < 0) {
      cell.classList.remove("fixed_last_cell_head");
    }
  });
};

const getCalculatedHeight = computed(() => {
  if (props.fixedHeight) {
    if (limit.value < 13) {
      return "dd-max-h-[calc(100vh-200px)] dd-min-h-[calc(100vh-200px)]";
    }
  }
});

const setActiveButton = computed(() => {
  return (label) => {
    return selectedButton.value === label
      ? "!dd-text-gray-700 !dd-font-medium"
      : "";
  };
});

const setTableHeader = computed(() => {
  if (props.actionHeader === true && selectedId.value.length > 0) {
    return false;
  } else if (search.value === true) {
    return false;
  } else if (props.actionHeader === false && selectedId.value.length > 0) {
    return true;
  } else {
    return true;
  }
});

const allSelected = ref(false);
const selectedId = ref([]);
const search = ref(false);
const hoveredColumn = ref(null);
const hoveredRow = ref(null);
const isMouseHovered = ref(false);
const selectedButton = ref(props.buttonselected);
const setting = ref(false);
const limit = ref(props.limitVal);
const queryInput = ref("");
const savedData = ref([]);
const settingElement = ref(null);
const settingIcon = ref(null);
const allCheckboxesChecked = ref(false);
const headerActions = ref(props.headerselectedActions);
const modelColumn = ref(props.columns);

const selectNumberOfRows = (button) => {
  emits("numberOfRow", button);
  setTimeout(() => {
    handleScroll();
  }, 50);
};

//dom click
const handleDomClick = (event) => {
  if (
    settingElement.value &&
    !settingElement.value.contains(event.target) &&
    !settingIcon.value.$el.contains(event.target)
  ) {
    setting.value = false;
  }
};

const searchQuery = (val) => {
  queryInput.value = val;
  emits("searchQuery", val);
};

const loadMore = () => {
  emits("loadmore", {
    button: props.buttons,
    perPage: selectedButton.value,
    limit: limit.value,
  });
  setTimeout(() => {
    handleScroll();
  }, 0);
};
onMounted(() => {
  handleScroll();
  document.addEventListener("click", handleDomClick);
});
onBeforeMount(() => {
  limit.value = props.rows.length;
  document.addEventListener("click", handleDomClick);
});

watch(
  () => selectedId.value,
  (newValue) => {
    selectedId.value = newValue;
  }
);

const selectAllFields = () => {
  if (allSelected.value === false) {
    selectedId.value = [];
    setting.value = false;
    props.rows.forEach((row) => {
      if (!row?.disabled === true) {
        selectedId.value.push(row?.id);
        emits("allCheckboxes", row);
      }
    });
  } else {
    search.value = false;
    selectedId.value = [];
    setTimeout(() => {
      ~handleScroll();
    }, 0);
  }
  allSelected.value = !allSelected.value;
};

const setChecked = (id) => {
  if (props.checkBoxProp === false || props.checkAllDisabled === true) return;
  const index = selectedId.value.indexOf(id);
  if (index === -1) {
    selectedId.value.push(id);
    setting.value = false;
    emits("selectedCheckBoxes", selectedId.value);
  } else {
    search.value = false;
    selectedId.value.splice(index, 1);
    setTimeout(() => {
      handleScroll();
    }, 0);
  }
};

const clickedRow = (row) => {
  emits("selectedRow", row);
};

const indeterminate = () => {
  if (selectedId.value.length === limit.value) {
    return (allSelected.value = true);
  }
};

watchEffect(() => {
  if (selectedId.value.length !== limit.value) {
    return (allSelected.value = false);
  }
});

const setSetting = (col) => {
  col = !col;
};

const watchState = () => {
  savedData.value = modelColumn.value;
  console.log(savedData.value, "savedData.value");
};
watch(
  () => savedData.value,
  (newArr) => {
    savedData.value = newArr;
  },
  { immediate: true }
);

const saveSettings = () => {
  emits("updateSettings", modelColumn.value);
  setTimeout(() => {
    handleScroll();
  }, 0);
};

const showIcon = (element) => {
  element.disabled ? (element.hovered = false) : (element.hovered = true);
};

const hideIcon = (element) => {
  element.hovered = false;
};

const resetDefault = () => {
  emits("resetData", modelColumn.value);
  setTimeout(() => {
    handleScroll();
  }, 0);
};

const openSearch = () => {
  if (limit.value < 1) return;
  search.value = true;
  setting.value = false;
};
const closeSearch = () => {
  search.value = false;
  setTimeout(() => {
    handleScroll();
  }, 0);
};

const isHovered = (col) => {
  return hoveredColumn.value === col;
};
const handleMouseEnter = (col) => {
  hoveredColumn.value = col;
};
const handleMouseLeave = () => {
  hoveredColumn.value = null;
};

const handleMouseEnterActions = (rowData) => {
  if(props.presistAction == true) return;
  hoveredRow.value = rowData;
  isMouseHovered.value = true;
};

const handleMouseLeaveActions = () => {
  if(props.presistAction == true) return;
  hoveredRow.value = null;
  isMouseHovered.value = false;
};

const sortRows = (col) => {
  emits("sort", col);
};

const openSettingsBar = () => {
  if (limit.value < 1) return;
  setting.value = !setting.value;
};

const editRow = () => {
  emits("editRow");
};
const deleteRow = () => {
  emits("deleteRow");
};
const dropdownValue = (data) => {
  emits("dropdownValue", data);
};
const getHeaderDropdownVal = (data) => {
  emits("headerDropdown", data);
};
</script>

<style scoped>
.table_head_row::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.selected-label {
  font-weight: bold !important;
}

/* fixed column */
tr:hover td:not(:first-child),
tr:hover>td:first-child {
  background-color: #f9fafb;
}

.fixedScroll {
  overflow: scroll;
}

.fixedScroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.fixedScroll::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.empty_state {
  overflow-y: scroll;
}

.empty_state::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.empty_state::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.checkbox_cell_wrapper {
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 999;
}

.fixed_head_cell_one {
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 999 !important;
}

.fixed_cell_one {
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 10 !important;
}

.fixed_cell_two {
  position: sticky;
  left: 52px;
  background: #ffff;
  margin: 0 !important;
  box-shadow: -2px 0 2px -2px rgba(0, 0, 0, 0.2) inset;
  z-index: 999 !important;
}

.fixed_cell_two_head {
  position: sticky;
  left: 52px;
  background: #ffff;
  margin: 0 !important;
  z-index: 999 !important;
}

.fixed_last_cell {
  position: sticky;
  right: 0;
  background: #ffff;
  margin: 0 !important;
  box-shadow: 2px 0 2px -2px rgba(0, 0, 0, 0.12) inset;
}

.fixed_last_cell_head {
  position: sticky;
  right: 0;
  background: #ffff;
}

.fixedScroll .group_wrapper:nth-child(1) {
  position: sticky;
  left: 0;
}

/* icon rotation  */
.rotated {
  transform: rotate(-180deg);
  transition: transform 0.5s ease;
}

.rotatedReverse {
  transform: rotate(0deg);
  transition: transform 0.5s ease;
}

/* setting animation  */

.setting-enter-active {
  opacity: 1;
  transition: all 0.5s ease-in-out;
}

.setting-enter-from {
  opacity: 0;
  transition: all 0.5s ease-out;
}

.setting-leave-to {
  opacity: 0;
  transition: all 0.5s ease;
}

.setting-leave-from {
  opacity: 1;
  transition: all 0.5s ease-out;
}

.drag-class {
  background-color: #fff;
  border: 1px solid #e6e6e6;
}

.ghost-class {
  background-color: #fcfbfb;
}

.ghost-class>div {
  visibility: hidden;
}

.table_border::after {
  border-bottom: 1px solid #e5e7eb;
}

/* scroll bar  */

/* .custom-scrollbar {
  scrollbar-width: 2px;
  scrollbar-color: #f1f1f1 !important;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #fff;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:horizontal {
  width: 3px;
} */
</style>
