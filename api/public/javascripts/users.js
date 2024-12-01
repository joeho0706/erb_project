function confirmDelete() {
  return confirm('Are you sure you want to delete this user?');
}

function generateFakeUsers() {
  if (confirm('Do you want to generate fake users?')) {
    let count = prompt('Enter the number of fake users to generate:');
    if (count !== null && count !== '') {
      window.location.href = `/users/generate-fake-users?count=${count}`;
    }
  }
}

function deleteAllUsers() {
  if (
    confirm(
      'Are you sure you want to delete all users? This action cannot be undone.'
    )
  ) {
    fetch('/users', { method: 'DELETE' }).then((response) => {
      if (response.ok) {
        window.location.href = '/users';
      } else {
        alert('Failed to delete all users.');
      }
    });
  }
}
