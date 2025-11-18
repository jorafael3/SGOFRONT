import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { TableComponent } from "../../../../shared/components/ui/table/table.component";
import { TableConfigs, CustomButton } from '../../../../shared/interface/common';
import { OymService } from '../../../../services/oym/oym.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-politicas',
  imports: [CommonModule, FormsModule, CardComponent, TableComponent],
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.scss']
})

export class PoliticasComponent {
  newFolderName: string = '';
  folders: Array<{ name: string; path: string }> = [];
  selectedFiles: File[] = [];
  selectedFolder: string | null = null;
  selectedFolderName: string | null = null;
  filesMap: { [folderPath: string]: Array<any> } = {};
  currentPath: string = 'politicas';
  pathStack: string[] = ['politicas'];

  public customButtons: CustomButton[] = [
    {
      label: '',
      action: 'add_file',
      icon: 'fa fa-plus',
      class: 'btn btn-success',
      tooltip: 'Agregar nuevo archivo'
    },
  ];

  filesTableConfig: TableConfigs = {
    columns: [
      { title: 'Nombre', field_value: 'nameHtml', sort: true  },
      { title: 'Version', field_value: 'version', sort: true },
      { title: 'Titulo', field_value: 'title', sort: true }
    ],
    row_action: [
      {
        label: '',
        action_to_perform: 'edit_file',
        icon: 'edit',
        type: 'button',
        class: 'btn btn-light btn-sm',
        tooltip: 'Editar'
      },
      {
        label: '',
        action_to_perform: 'delete_file',
        icon: 'trash',
        type: 'button',
        class: 'btn btn-danger btn-sm',
        tooltip: 'Eliminar'
      }
    ],
    data: []
  };

  constructor(private OymService: OymService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.getDepartments();
    this.loadPath(this.currentPath);
  }

  getDepartments() {
    this.OymService.getDepartamentos().subscribe({
      next: (res: any) => {
        console.log('Departamentos:', res || []);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadPath(subpath: string) {
    this.OymService.CargarCarpetaMPPs({ subpath }).subscribe({
      next: (res: any) => {
        if (!res || !res.success) {
          this.folders = [];
          this.filesTableConfig = { ...this.filesTableConfig, data: [] };
          this.selectedFolder = null;
          this.selectedFolderName = null;
          return;
        }
        const effectivePath = res.currentPath || subpath || 'politicas';
        this.currentPath = effectivePath;
        const parts = (effectivePath || '').split('/').filter(Boolean);
        const isRoot = parts.length === 1;

        // Lista de carpetas HIJAS en la columna izquierda
        this.folders = (res.folders || []).map((f: any) => ({
          name: f.name,
          path: f.path || f.name
        }));
        const files = (res.files || []).map((f: any) => {
          const ext = (f.extension || '').toLowerCase();
          const icon = this.getIconForExt(ext);
          const href = `${environment.sgo_docs_base}/${(f.path).split('/').map(encodeURIComponent).join('/')}`;
          const nameHtml = `<i class="${icon.cls} me-2"></i> <a href="${href}" download target="_blank" rel="noopener"> ${(f.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')} </a>`;
          console.log('file mapping: ', f, nameHtml);
          console.log('file mapping: ', href);
          console.log('file mapping: ', f.path);
          return {
            id: f.path,
            name: f.name,
            nameHtml,
            path: f.path,
            version: f.version || '',
            title: f.title || f.name,
            size: f.size,
            modified: f.modified,
            extension: ext
          };
        });
        // Si estamos en root: no hay carpeta seleccionada
        if (isRoot) {
          this.selectedFolder = null;
          this.selectedFolderName = null;
        } else {
          this.selectedFolder = effectivePath;
          this.selectedFolderName = parts[parts.length - 1] || effectivePath;
        }

        this.filesMap[effectivePath] = files;
        this.filesTableConfig = { ...this.filesTableConfig, data: files };
      },
      error: (err) => {
        console.error(err);
        this.folders = [];
        this.filesTableConfig = { ...this.filesTableConfig, data: [] };
      }
    });
  }

  createFolder() {
    const name = (this.newFolderName || '').trim();
    if (!name) {
      Swal.fire('Error', 'Ingrese un nombre de carpeta válido.', 'error');
      return;
    }
    const subpath = `${this.currentPath}/${name}`;
    this.OymService.CrearCarpetaMPPs({ subpath }).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          Swal.fire('¡Éxito!', 'Carpeta creada correctamente', 'success');
          this.newFolderName = '';
          this.loadPath(this.currentPath); // recargar hijos
        } else {
          Swal.fire('Error', res?.message || 'No se pudo crear la carpeta', 'error');
        }
      },
      error: (err) => {
        console.error(err);
        const msg = err?.error?.message || 'Error al crear carpeta';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  selectFolder(folderPath: string) {
    this.pathStack.push(folderPath);
    this.loadPath(folderPath);
  }

  goBackToDepartments() {
    this.pathStack = ['politicas'];
    this.loadPath('politicas');
  }

  goBackOneLevel() {
    if (this.pathStack.length > 1) {
      this.pathStack.pop();
      const prev = this.pathStack[this.pathStack.length - 1];
      this.loadPath(prev);
    }
  }

  deleteFolder(event: any, folderPath: string) {
    if (event && event.stopPropagation) event.stopPropagation();
    if (!folderPath) return;

    Swal.fire({
      title: '¿Eliminar carpeta?',
      html: `Eliminar carpeta "${folderPath}"? Esta acción también eliminará su contenido.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.OymService.EliminarCarpetaMPPs({ subpath: folderPath }).subscribe({
        next: (res: any) => {
          if (res && res.success) {
            Swal.fire('¡Eliminada!', 'Carpeta eliminada correctamente', 'success');
            this.loadPath(this.currentPath);
            if (this.selectedFolder === folderPath) {
              this.selectedFolder = null;
              this.selectedFolderName = null;
              this.filesTableConfig = { ...this.filesTableConfig, data: [] };
            }
          } else {
            Swal.fire('Error', res?.message || 'No se pudo eliminar la carpeta', 'error');
          }
        },
        error: (err) => {
          console.error(err);
          const msg = err?.error?.message || 'Error al eliminar carpeta';
          Swal.fire('Error', msg, 'error');
        }
      });
    });
  }


  onCustomAction(event: { action: string, data?: any }) {
    if (!event || !event.action) return;

    switch (event.action) {
      case 'add_file':
        this.showAddFileModal();
        break;
      default:
        break;
    }
  }

  showAddFileModal() {
    if (!this.selectedFolder) {
      Swal.fire('Error', 'Selecciona una carpeta primero', 'error');
      return;
    }
    Swal.fire({
      title: 'Agregar Archivo',
      html: `
        <div class="mb-3">
          <label class="form-label">Archivo</label>
          <input id="swal-input-file" type="file" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Versión</label>
          <input id="swal-input-version" class="form-control" placeholder="1.0">
        </div>
        <div class="mb-3">
          <label class="form-label">Título</label>
          <input id="swal-input-title" class="form-control" placeholder="Políticas v1">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      focusConfirm: false,
      preConfirm: () => {
        const fileInput = (document.getElementById('swal-input-file') as HTMLInputElement);
        const version = (document.getElementById('swal-input-version') as HTMLInputElement).value;
        const title = (document.getElementById('swal-input-title') as HTMLInputElement).value;

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
          Swal.showValidationMessage('Debes seleccionar un archivo');
          return false;
        }

        if (!version || !title) {
          Swal.showValidationMessage('Versión y Título son requeridos');
          return false;
        }

        const file = fileInput.files[0];
        const rawName = file.name || 'file';
        const name = rawName.replace(/\.[^/.]+$/, '');
        return { file, name, version, title };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const payload: any = result.value;
        const file: File = payload.file;
        const metadata = { name: payload.name, version: payload.version, title: payload.title };
        const subpath = this.selectedFolder || '';

        this.OymService.GuardarArchivoMPPs(file, subpath, metadata).subscribe({
          next: (res: any) => {
            if (res && res.success) {
              Swal.fire('¡Éxito!', 'Archivo guardado correctamente', 'success');
              if (this.selectedFolder) this.selectFolder(this.selectedFolder);
              else this.loadPath(this.currentPath);
            } else {
              Swal.fire('Error', res && res.message ? res.message : 'No se pudo guardar el archivo', 'error');
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Error al subir archivo', 'error');
          }
        });
      }
    }).catch(err => {
      console.error('Error leyendo archivo:', err);
      Swal.fire('Error', 'No se pudo leer el archivo', 'error');
    });
  }

  onFileTableAction(action: any) {
    if (!action || !action.action_to_perform) return;
    const row = action.data;
    switch (action.action_to_perform) {
      case 'edit_file':
        this.editFile(row);
        break;
      case 'delete_file':
        this.deleteFile(row);
        break;
      default:
    }
  }

  editFile(file: any) {
    if (!file) return;

    Swal.fire({
      title: 'Editar Archivo',
      html: `
      <div class="mb-3">
        <label class="form-label">Archivo (opcional, para reemplazar)</label>
        <input id="swal-input-file" type="file" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Versión</label>
        <input id="swal-input-version" class="form-control" value="${file.version || ''}" placeholder="1.0">
      </div>
      <div class="mb-3">
        <label class="form-label">Título</label>
        <input id="swal-input-title" class="form-control" value="${file.title || ''}" placeholder="Políticas v1">
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      focusConfirm: false,
      preConfirm: () => {
        const fileInput = document.getElementById('swal-input-file') as HTMLInputElement;
        const versionInput = document.getElementById('swal-input-version') as HTMLInputElement;
        const titleInput = document.getElementById('swal-input-title') as HTMLInputElement;

        const version = (versionInput?.value || '').trim();
        const title = (titleInput?.value || '').trim();
        const newFile = (fileInput?.files && fileInput.files.length > 0)
          ? fileInput.files[0]
          : null;

        if (!version || !title) {
          Swal.showValidationMessage('Versión y Título son requeridos');
          return false;
        }

        return { newFile, version, title };
      }
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return;

      const { newFile, version, title } = result.value;

      const currentPath: string = (file.path || file.id || '').toString();
      if (!currentPath) {
        Swal.fire('Error', 'Ruta del archivo inválida.', 'error');
        return;
      }

      // 1) Si NO hay nuevo archivo: solo actualizar metadata
      if (!newFile) {
        this.OymService.EditarArchivoMPPs(currentPath, currentPath, {
          // mantenemos el mismo "name" lógico que ya se muestra
          name: file.name,
          title,
          version
        }).subscribe({
          next: (res: any) => {
            if (res && res.success) {
              Swal.fire('¡Éxito!', 'Metadatos actualizados correctamente', 'success');
              if (this.selectedFolder) {
                this.selectFolder(this.selectedFolder);
              }
            } else {
              Swal.fire('Error', res?.message || 'No se pudo actualizar el archivo', 'error');
            }
          },
          error: (err) => {
            console.error(err);
            const msg = err?.error?.message || 'Error al actualizar archivo';
            Swal.fire('Error', msg, 'error');
          }
        });

        return;
      }

      // 2) Si hay nuevo archivo: subir nuevo + borrar el anterior
      const rawName = newFile.name || 'file';
      const nameWithoutExt = rawName.replace(/\.[^/.]+$/, '');

      const metadata = {
        name: nameWithoutExt,
        title,
        version
      };

      // carpeta donde está actualmente el archivo
      const lastSlash = currentPath.lastIndexOf('/');
      const dir = lastSlash >= 0 ? currentPath.substring(0, lastSlash) : (this.selectedFolder || '');

      this.OymService.GuardarArchivoMPPs(newFile, dir, metadata).subscribe({
        next: (saveRes: any) => {
          if (!saveRes || !saveRes.success) {
            Swal.fire('Error', saveRes?.message || 'No se pudo guardar el nuevo archivo', 'error');
            return;
          }

          // Eliminar archivo anterior
          this.OymService.EliminarArchivoMPPs(currentPath).subscribe({
            next: (delRes: any) => {
              if (!delRes || !delRes.success) {
                // El nuevo quedó guardado, pero el viejo no se borró
                Swal.fire('Advertencia', 'Nuevo archivo guardado, pero no se pudo eliminar el anterior.', 'warning');
              } else {
                Swal.fire('¡Éxito!', 'Archivo actualizado correctamente', 'success');
              }
              if (this.selectedFolder) {
                this.selectFolder(this.selectedFolder);
              }
            },
            error: (err) => {
              console.error(err);
              Swal.fire(
                'Advertencia',
                'Nuevo archivo guardado, pero ocurrió un error al eliminar el anterior.',
                'warning'
              );
              if (this.selectedFolder) {
                this.selectFolder(this.selectedFolder);
              }
            }
          });
        },
        error: (err) => {
          console.error(err);
          const msg = err?.error?.message || 'Error al subir el nuevo archivo';
          Swal.fire('Error', msg, 'error');
        }
      });
    });
  }

  deleteFile(file: any) {
    if (!file) return;
    if (!this.selectedFolder) return;

    Swal.fire({
      title: '¿Eliminar archivo?',
      html: `
        <div class="text-start">
          <p>¿Estás seguro de eliminar el siguiente archivo?</p>
          <ul class="list-unstyled">
            <li><strong>Nombre:</strong> ${file.name}</li>
            <li><strong>Versión:</strong> ${file.version}</li>
            <li><strong>Título:</strong> ${file.title}</li>
          </ul>
          <p class="text-danger">Esta acción no se puede deshacer.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) {
        const path = file.path || file.id || file.name;
        this.OymService.EliminarArchivoMPPs(path).subscribe({
          next: (res: any) => {
            if (res && res.success) {
              Swal.fire('¡Eliminado!', 'El archivo ha sido eliminado.', 'success');
              if (this.selectedFolder) this.selectFolder(this.selectedFolder);
            } else {
              Swal.fire('Error', res && res.message ? res.message : 'No se pudo eliminar archivo', 'error');
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Error al eliminar archivo', 'error');
          }
        });
      }
    });
  }

  private getIconForExt(ext: string) {
    const e = (ext || '').toLowerCase();
    const inSet = (set: string[]) => set.includes(e);

    if (inSet(['pdf'])) return { cls: 'fa-solid fa-file-pdf text-danger', label: 'PDF' };
    if (inSet(['doc', 'docx', 'rtf'])) return { cls: 'fa-solid fa-file-word text-primary', label: 'Word' };
    if (inSet(['xls', 'xlsx', 'csv'])) return { cls: 'fa-solid fa-file-excel text-success', label: 'Excel' };
    if (inSet(['ppt', 'pptx'])) return { cls: 'fa-solid fa-file-powerpoint text-warning', label: 'PowerPoint' };
    if (inSet(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'])) return { cls: 'fa-solid fa-file-image text-info', label: 'Imagen' };
    if (inSet(['txt', 'md', 'log'])) return { cls: 'fa-solid fa-file-lines', label: 'Texto' };
    if (inSet(['zip', 'rar', '7z'])) return { cls: 'fa-solid fa-file-zipper', label: 'Comprimido' };
    if (inSet(['json', 'xml', 'yml', 'yaml'])) return { cls: 'fa-solid fa-file-code', label: 'Código' };
    return { cls: 'fa-solid fa-file', label: 'Archivo' };
  }

}
