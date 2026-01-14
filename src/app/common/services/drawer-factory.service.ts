import { inject, Injectable } from "@angular/core";
import { DrawerService } from "./drawer.service";

@Injectable({ providedIn: 'root' })
export class DrawerFactory {
    private drawerService = inject(DrawerService);
    
    openDebtDrawer(config: Partial<any>): void {
        this.drawerService.open<any>({
            title: 'Deuda',
            ...config
        });
    }

    openDebtCreate(): void {
        this.openDebtDrawer({
            key: 'debt-drawer',
            title: 'Nueva Deuda',
            data: {}, 
            metadata: { 
                mode: 'edit' 
            }
        });
    }
    openDebtView(debt: any): void {
        this.openDebtDrawer({
            key: 'debt-drawer',
            title: `Detalle: ${debt.description}`,
            data: debt,
            metadata: { 
                Id: debt.id, 
                mode: 'view' 
            }
        });
    }

    openDebtForm(debt: any = null): void {
        console.log('Opening debt form with debt:', debt);
        this.drawerService.open<any>({
            key: 'debt-drawer',
            title: debt ? 'Detalle Deuda' : 'Nueva Deuda',
            data: debt,
            metadata: { 
                Id: debt?.id, 
                mode: debt ? 'view' : 'edit' 
            }
        });
    }
    // --- Tus métodos anteriores (Libros) ---
    // openBookDrawer(config: Partial<any>): void {
    //     this.drawerService.open<any>({
    //         title: 'Libro',
    //         ...config
    //     });
    // }
    
    // openBookView(book: any): void {
    //     this.openBookDrawer({
    //         key: 'book-drawer',
    //         title: 'Detalle Libre',
    //         data: book,
    //         metadata: { Id: book.id, mode: 'view' }
    //     });
    // }
}