import { Component } from '@angular/core';
import Swal from 'sweetalert2';

import { CardComponent } from '../../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-confirmation-approval-sweetalert',
  imports: [CardComponent],
  templateUrl: './confirmation-approval-sweetalert.component.html',
  styleUrl: './confirmation-approval-sweetalert.component.scss'
})

export class ConfirmationApprovalSweetalertComponent {

  open() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error",
          });
        }
      });
  }
}
