<template>
  <Teleport to="#appBreadcrumb">
    <ol class="breadcrumb mb-0 ps-3">
      <li class="breadcrumb-item">Demo</li>
      <li class="breadcrumb-item active">Demo Date Picker</li>
    </ol>
  </Teleport>

  <h4>Basic Usage</h4>
  <p>Basic use case. Users can select or input a date in panel.</p>
  <p>Các thuộc tính v-model:value đều có kiểu dữ liệu là dayjs.</p>
  <div class="mb-4">
    <a-space
      direction="vertical"
      :size="12"
    >
      <a-date-picker
        v-model:value="demo1.value1"
        :format="'DD-MM-YYYY'"
      />

      <div>
        {{ demo1.value1 }}
      </div>

      <a-date-picker
        v-model:value="demo1.value6"
        :format="'DD-MM-YYYY'"
      />

      <a-date-picker
        v-model:value="demo1.value2"
        picker="week"
      />
      <a-date-picker
        v-model:value="demo1.value3"
        picker="month"
      />
      <a-date-picker
        v-model:value="demo1.value4"
        picker="quarter"
      />
      <a-date-picker
        v-model:value="demo1.value5"
        picker="year"
      />
    </a-space>
  </div>

  <h4>Range Picker</h4>
  <p>Set range picker type by picker prop.</p>
  <div class="mb-4">
    <a-space
      direction="vertical"
      :size="12"
    >
      <a-range-picker
        v-model:value="demo2.value1"
        :ranges="ranges"
      />

      <div>
        {{ demo2.value1 }}
      </div>

      <a-range-picker
        v-model:value="demo2.value2"
        show-time
      />
      <a-range-picker
        v-model:value="demo2.value3"
        picker="week"
      />
      <a-range-picker
        v-model:value="demo2.value4"
        picker="month"
      />
      <a-range-picker
        v-model:value="demo2.value5"
        picker="year"
      />
    </a-space>
  </div>

  <h4>Switchable picker</h4>
  <p>Switch in different types of pickers by Select.</p>
  <div class="mb-4">
    <a-space
      direction="vertical"
      :size="12"
    >
      <a-select v-model:value="type">
        <a-select-option value="time">Time</a-select-option>
        <a-select-option value="date">Date</a-select-option>
        <a-select-option value="week">Week</a-select-option>
        <a-select-option value="month">Month</a-select-option>
        <a-select-option value="quarter">Quarter</a-select-option>
        <a-select-option value="year">Year</a-select-option>
      </a-select>

      <template v-if="type === 'time'">
        <a-time-picker />
      </template>
      <template v-else>
        <a-date-picker :picker="type" />
      </template>
    </a-space>
  </div>

  <h4></h4>
  <p></p>
  <div class="mb-4">
  </div>

  <h4></h4>
  <p></p>
  <div class="mb-4">
  </div>

  <h4></h4>
  <p></p>
  <div class="mb-4">
  </div>
</template>


<script setup>
import dayjs from 'dayjs'
// import isoWeek from 'dayjs/plugin/isoWeek'

// Khai báo ở main.js
// dayjs.extend(isoWeek)

// Demo 1
const demo1 = reactive({
  value1: dayjs(),
  value2: null,
  value3: '',
  value4: '',
  value5: '',
  value6: dayjs('1987-05-11', 'YYYY-MM-DD'),
})


// Demo 2
const demo2 = reactive({
  // value1: null,
  value1: [dayjs().subtract(7, 'day'), dayjs()],
  value2: null,
  value3: null,
  value4: null,
  value5: null,
})

const ranges = {
  // Today: [dayjs(), dayjs()],
  // 'This Month': [dayjs(), dayjs().endOf('month')],

  'Hôm nay': [dayjs().startOf('day'), dayjs()],
  'Hôm qua': [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
  '7 ngày qua': [dayjs().subtract(6, 'day').startOf('day'), dayjs()],
  '30 ngày qua': [dayjs().subtract(29, 'day').startOf('day'), dayjs()],
  // Đang lỗi chỗ tuần, phải thêm plugin isoWeek
  'Tuần này': [dayjs().startOf('isoWeek').startOf('day'), dayjs()], // endOfWeek
  'Tuần trước': [dayjs().subtract(1, 'week').startOf('isoWeek').startOf('day'), dayjs().subtract(1, 'week').endOf('isoWeek').endOf('day')],
  'Tháng này': [dayjs().startOf('month').startOf('day'), dayjs()], // endOfMonth
  'Tháng trước': [dayjs().subtract(1, 'month').startOf('month').startOf('day'), dayjs().subtract(1, 'month').endOf('month').endOf('day')],
}


// Demo 3
const type = ref('time')
</script>
