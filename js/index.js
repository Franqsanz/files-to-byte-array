document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const dropArea = document.getElementById('dropArea');
  const pre = document.querySelector('.byteArrayOutput');
  const copyButton = document.querySelector('#copyButton');
  const cancelButton = document.querySelector('#cancelButton');
  const loading = document.getElementById('loading');
  const modalContent = document.querySelector('.modalContent');
  const img = document.querySelector('img');

  fileInput.addEventListener('change', handleFiles);
  dropArea.addEventListener('dragover', handleDragOver);
  dropArea.addEventListener('drop', handleDrop);
  copyButton.addEventListener('click', copyToClipboard);
  cancelButton.addEventListener('click', () => {
    modalContent.style.display = 'none';
    fileInput.value = '';
  });

  function handleFiles(event) {
    const files = event.target.files;
    processFiles(files);
  }

  function handleDragOver(event) {
    event.preventDefault();
    dropArea.classList.add('dragover');
  }

  function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    dropArea.classList.remove('dragover');
    processFiles(files);
  }

  function processFiles(files) {
    const readers = [];

    loading.style.display = 'block';
    pre.textContent = '';

    for (const file of files) {
      const reader = new FileReader();

      const promise = new Promise((resolve) => {
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const blob = new Blob([arrayBuffer]);
          // img.setAttribute('src', URL.createObjectURL(blob));
          // Convert Blob to ArrayBuffer
          blob.arrayBuffer().then((newArrayBuffer) => {
            // Convert ArrayBuffer to Uint8Array
            const byteArray = [...new Uint8Array(newArrayBuffer)];
            const byteArrayString = formatByteArray(byteArray);
            pre.textContent = byteArrayString;
            modalContent.style.display = 'flex';

            resolve();
          });
        };
        reader.readAsArrayBuffer(file);
      });

      readers.push(promise);
    }

    Promise.all(readers).then(() => {
      loading.style.display = 'none';
    });
  }

  function formatByteArray(byteArray) {
    return `[${byteArray}]`;
  }

  function copyToClipboard() {
    const text = pre.textContent;

    navigator.clipboard.writeText(text).then(
      () => {
        alert('Copied to clipboard!');
      },
      () => {
        alert('Failed to copy');
      }
    );
  }
});
