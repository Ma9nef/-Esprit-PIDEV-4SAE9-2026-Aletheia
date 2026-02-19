import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// product-form is at: src/app/features/products/product-form/
// core/models is at:  src/app/core/models/
// relative path:      ../../../core/models/
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    DialogModule, ButtonModule, InputTextModule, TextareaModule,
    InputNumberModule, SelectModule, ToggleSwitchModule,
    FileUploadModule, ProgressBarModule, DividerModule, ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() product: Product | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<Product>();

  // inject() avoids NG2003 strict-mode injection token error
  private fb             = inject(FormBuilder);
  private productService = inject(ProductService);
  private messageService = inject(MessageService);

  form!: FormGroup;
  saving         = false;
  isEdit         = false;
  uploadingCover = false;
  uploadingFile  = false;
  coverPreviewUrl: string | null = null;

  typeOptions = [
    { label: '📚 Book',      value: 'BOOK' },
    { label: '📱 Ebook',     value: 'EBOOK' },
    { label: '🎧 Audiobook', value: 'AUDIOBOOK' },
    { label: '📰 Magazine',  value: 'MAGAZINE' },
  ];

  constructor() {
    this.buildForm();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.visible) {
      if (this.product) {
        this.isEdit = true;
        this.form.patchValue(this.product);
        this.coverPreviewUrl = this.product.coverImageUrl ?? null;
      } else {
        this.isEdit = false;
        this.form.reset({ price: 0, available: true, type: 'BOOK' });
        this.coverPreviewUrl = null;
      }
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      title:         ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      description:   [''],
      author:        [''],
      type:          ['BOOK', Validators.required],
      price:         [0,  [Validators.required, Validators.min(0)]],
      fileUrl:       [''],
      coverImageUrl: [''],
      available:     [true]
    });
  }

  onCoverSelect(event: { files: File[] }): void {
    const file = event.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.coverPreviewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.uploadingCover = true;
    this.productService.uploadFile(file, 'cover').subscribe({
      next: (res: { url: string }) => {
        this.form.patchValue({ coverImageUrl: res.url });
        this.uploadingCover = false;
        this.messageService.add({ severity: 'success', summary: 'Cover uploaded!', life: 2000 });
      },
      error: () => {
        this.uploadingCover = false;
        this.messageService.add({
          severity: 'warn', summary: 'Upload failed',
          detail: 'Could not upload cover. Paste a URL manually.', life: 4000
        });
      }
    });
  }

  removeCover(): void {
    this.coverPreviewUrl = null;
    this.form.patchValue({ coverImageUrl: '' });
  }

  onCoverUrlChange(url: string): void {
    this.coverPreviewUrl = url || null;
  }

  onFileSelect(event: { files: File[] }): void {
    const file = event.files[0];
    if (!file) return;

    this.uploadingFile = true;
    this.productService.uploadFile(file, 'file').subscribe({
      next: (res: { url: string }) => {
        this.form.patchValue({ fileUrl: res.url });
        this.uploadingFile = false;
        this.messageService.add({ severity: 'success', summary: 'File uploaded!', life: 2000 });
      },
      error: () => {
        this.uploadingFile = false;
        this.messageService.add({
          severity: 'warn', summary: 'Upload failed',
          detail: 'Could not upload file. Paste a URL manually.', life: 4000
        });
      }
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving = true;
    const payload = this.form.value as Product;
    const request = this.isEdit
      ? this.productService.update(this.product!.id!, payload)
      : this.productService.create(payload);

    request.subscribe({
      next: (result: Product) => {
        this.saving = false;
        this.saved.emit(result);
        this.close();
      },
      error: (err: { error?: { message?: string } }) => {
        this.saving = false;
        const detail = err?.error?.message ?? 'Something went wrong. Please try again.';
        this.messageService.add({ severity: 'error', summary: 'Save Failed', detail });
      }
    });
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl) return '';
    if (ctrl.hasError('required'))  return 'This field is required.';
    if (ctrl.hasError('minlength')) return `Minimum ${ctrl.errors?.['minlength'].requiredLength} characters.`;
    if (ctrl.hasError('maxlength')) return `Maximum ${ctrl.errors?.['maxlength'].requiredLength} characters.`;
    if (ctrl.hasError('min'))       return 'Value must be 0 or greater.';
    return '';
  }
}
