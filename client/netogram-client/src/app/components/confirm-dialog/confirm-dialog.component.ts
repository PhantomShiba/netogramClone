import { Component } from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";
import * as PostActions from "../../ngrx/post/post.actions";
import { PostModel } from '../../models/post.model';
import { Store } from '@ngrx/store';
import {ProfileState} from "../../ngrx/profile/profile.state";
import {PostState} from "../../ngrx/post/post.state";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private store: Store<{
      profile: ProfileState;
      post: PostState;
    }>,
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
