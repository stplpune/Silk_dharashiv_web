import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-referance',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule],
  templateUrl: './referance.component.html',
  styleUrls: ['./referance.component.scss']
})

export class ReferanceComponent {
  public todos: Todo[] = [];
  newTodoTitle: string = '';
  editFlag: boolean = false;
  updatedTodo: any
  private todosSubject = new BehaviorSubject<Todo[]>([]);

  constructor() { }

  ngOnInit() { }

  //#region ------------------------------------- table add edit and del fun start heare--------------------------------------- 

  addTodo() {
    if (!this.editFlag) { //add
      const newTodo: Todo = {
        id: Date.now(),
        title: this.newTodoTitle,
        completed: false
      };
      this.todos.push(newTodo);
    } else {//edit
      const index = this.todos.findIndex(todo => todo.id === this.updatedTodo.id);
      if (index !== -1) {
        this.updatedTodo.title = this.newTodoTitle
        this.todos[index] = this.updatedTodo;
        this.editFlag = false;
      }
    }
    this.emitTodos();
    this.newTodoTitle = '';
  }

  updateTodo(updatedTodo: Todo) {
    this.editFlag = true;
    this.updatedTodo = updatedTodo;
    this.newTodoTitle = updatedTodo?.title;
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.emitTodos();
  }

  private emitTodos() {
    this.todosSubject.next([...this.todos]);
  }

  //#endregion ------------------------------------- table add edit and del fun start heare--------------------------------------- 

}
