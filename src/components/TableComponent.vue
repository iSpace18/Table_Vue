<template>
  <div>
    <div class="toolbar">
      <input type="color" v-model="selectedColor" />
      <button @click="colorCells">Окрасить</button>
      <button @click="() => changeTextStyle('bold')">Bold</button>
      <button @click="() => changeTextStyle('italic')">Italic</button>
      <button @click="() => changeTextStyle('underline')">Underline</button>
      <button @click="addRow">+</button>
      <button @click="removeRow">-</button>
      <button @click="saveAsPDF">Сохранить</button>
    </div>
    <div class="table-container">
      <table id="myTable">
        <thead>
          <tr>
            <th></th>
            <th v-for="(col, index) in columns" :key="index">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <th>{{ rowIndex + 1 }}</th>
            <td
              v-for="(col, colIndex) in columns"
              :key="colIndex"
              contenteditable="true"
              @keydown.enter.prevent="evaluateCell($event, rowIndex, colIndex)"
              @click="selectCell(rowIndex, colIndex)"
              :class="{ selected: isSelected(rowIndex, colIndex) }"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { saveAsPDF } from "@/utils/tableUtils";
import { hexToRgb } from "@/utils/colorUtils";

export default defineComponent({
  name: "TableComponent",
  setup() {
    const columns = ref<string[]>(
      Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i))
    );
    const rows = ref<number[]>(Array.from({ length: 20 }, (_, i) => i + 1));
    const selectedCells = ref<{ row: number; col: number }[]>([]);
    const selectedColor = ref<string>("#000000");

    const addRow = () => {
      rows.value.push(rows.value.length + 1);
    };

    const removeRow = () => {
      if (rows.value.length > 1) {
        rows.value.pop();
      }
    };

    const selectCell = (row: number, col: number) => {
      selectedCells.value = [{ row, col }];
    };

    const isSelected = (row: number, col: number) => {
      return selectedCells.value.some(
        (cell) => cell.row === row && cell.col === col
      );
    };

    const evaluateCell = (event: KeyboardEvent, row: number, col: number) => {
      const cell = event.target as HTMLTableCellElement;
      try {
        cell.innerText = eval(cell.innerText);
      } catch {
        cell.innerText = "Error";
      }
    };

    const changeTextStyle = (style: string) => {
      selectedCells.value.forEach(({ row, col }) => {
        const cell = document
          .querySelectorAll("tbody tr")
          [row]?.querySelectorAll("td")[col];
        if (cell) {
          if (style === "bold") {
            cell.style.fontWeight =
              cell.style.fontWeight === "bold" ? "normal" : "bold";
          } else if (style === "italic") {
            cell.style.fontStyle =
              cell.style.fontStyle === "italic" ? "normal" : "italic";
          } else if (style === "underline") {
            cell.style.textDecoration =
              cell.style.textDecoration === "underline" ? "none" : "underline";
          }
        }
      });
    };

    const colorCells = () => {
      selectedCells.value.forEach(({ row, col }) => {
        const cell = document
          .querySelectorAll("tbody tr")
          [row]?.querySelectorAll("td")[col];
        if (cell) {
          cell.style.backgroundColor = selectedColor.value;
          cell.classList.remove("selected");

          const rgb = hexToRgb(selectedColor.value);
          const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
          cell.style.color = brightness > 125 ? "black" : "white";
        }
      });
    };

    return {
      columns,
      rows,
      selectedCells,
      selectedColor,
      addRow,
      removeRow,
      selectCell,
      isSelected,
      evaluateCell,
      changeTextStyle,
      colorCells,
      saveAsPDF,
    };
  },
});
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 800px;
  margin-left: 450px;
  background-color: rgba(0, 0, 0, 0.411);
  margin-bottom: 20px;
}

.selected {
  border: 1px solid rgb(0, 0, 0);
}

.table-container {
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #6287ff;
  text-align: left;
}

td[contenteditable="true"] {
  background-color: #fff;
}
</style>
