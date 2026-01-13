<template>
  <div class="side-todo">
    <div class="todo-input">
      <input
        v-model.trim="value"
        @keydown.enter="addTodo"
        placeholder="添加任务"
        type="text"
      />
    </div>
    <ul class="todo-unfinish">
      <li class="todo-item" v-for="(row, index) of todoStore.unfinish" :key="row.created">
        <el-checkbox
          :model-value="false"
          @change="finHandle(index)"
        ></el-checkbox>
        <span class="todo-item-text">{{ row.text }}</span>
        <el-icon
          class="todo-delete"
          @click.stop="todoDelete('unfinish', index)"
          title="删除"
        ><Close /></el-icon>
      </li>
    </ul>
    <!-- 已完成 -->
    <div class="finish-box" :class="{ active: active }">
      <div class="finish-btn d-flex-ver f14" @click="active = !active">
        <el-icon class="icon f14 mr5"><ArrowRight /></el-icon>
        已完成
      </div>
      <transition name="el-zoom-in-top">
        <ul class="todo-finish" v-show="active">
          <li
            class="todo-item d-elip"
            v-for="(row, index) of todoStore.finish"
            :key="row.created"
          >
            <el-checkbox
              :model-value="true"
              @change="unfinHandle(index)"
            ></el-checkbox>
            <span :title="row.text" class="todo-item-text">{{ row.text }}</span>
            <el-icon
              class="todo-delete"
              @click.stop="todoDelete('finish', index)"
              title="删除"
            ><Close /></el-icon>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/store/todo'
import { ArrowRight, Close } from '@element-plus/icons-vue'

const todoStore = useTodoStore()

const value = ref("")
const active = ref(true)

const addTodo = () => {
  if (value.value) {
    todoStore.addTodo(value.value)
    value.value = ""
  }
}

const finHandle = (index: number) => {
  todoStore.toggleFinish(index)
}

const unfinHandle = (index: number) => {
  todoStore.toggleUnfinish(index)
}

const todoDelete = (type: 'unfinish' | 'finish', index: number) => {
  if (type === 'unfinish') {
    todoStore.deleteUnfinish(index)
  } else {
    todoStore.deleteFinish(index)
  }
}
</script>

<style lang='less' scoped>
.side-todo {
  padding-top: 20px;
  overflow: hidden;
  background-color: var(--background-info);
  font-size: 14px;
  height: 100%;
  width: 100%;
  // 输入框
  .todo-input {
    input {
      color: rgba(var(--main-color), 0.8);
      padding: 0 10px;
      height: 60px;
      font-size: 16px;
      line-height: 40px;
      background: rgba(var(--main-color), 0.1);
      display: block;
      box-sizing: border-box;
      width: 100%;
      border: none;
      outline: none;
    }
  }
  // 列表
  .todo-item {
    padding: 0 15px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: rgba(var(--main-color), 0.9);
    min-height: 50px;
    line-height: 24px;
    border-bottom: 1px solid rgba(var(--main-color), 0.05);
    .todo-item-text {
      margin-left: 10px;
      flex: 1;
    }
    .todo-delete {
      display: none;
      cursor: pointer;
      font-size: 18px;
      color: rgba(var(--main-color), 0.4);
      transition: 0.2s;
      &:hover {
        color: rgba(var(--main-color), 0.5);
      }
    }
    &:hover {
      background-color: rgba(var(--main-color), 0.05);
      .todo-delete {
        display: block;
      }
    }
  }
  .todo-finish {
    .todo-item {
      .todo-item-text {
        text-decoration: line-through;
        color: #999;
      }
      color: #999;
    }
  }
}
.finish-box {
    .finish-btn {
      padding: 0 10px;
      height: 40px;
      cursor: pointer;
      background-color: rgba(var(--main-color), 0.06);
      color: rgba(var(--main-color), 0.8);
      display: flex;
      align-items: center;
      .icon {
        transition: 0.2s;
      }
    }
    &.active {
      .icon {
        transform: rotate(90deg);
      }
    }
  }

  ::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #777;
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #777;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #777;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #777;
  }
}
</style>