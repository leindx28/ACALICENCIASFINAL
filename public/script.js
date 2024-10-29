e,
                    VersionAdapter: cells[4].querySelector('input').value,
                    FechaActualizacion: fechaActInput.value || null
                };

                fetch(`/api/clientes/${clienteId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(clienteActualizado)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        mostrarMensaje(data.error, 'error');
                    } else {
                        mostrarMensaje('Cliente actualizado con éxito');
                        cells[0].textContent = clienteActualizado.NombreCliente;
                        cells[1].textContent = fechaExpInput.value ? formatDate(fechaExpInput.value) : '';
                        cells[2].textContent = clienteActualizado.VersionAnalytics;
                        cells[3].textContent = clienteActualizado.VersionConnector;
                        cells[4].textContent = clienteActualizado.VersionAdapter;
                        cells[5].textContent = fechaActInput.value ? formatDate(fechaActInput.value) : '';

                        e.target.textContent = 'Editar';
                        e.target.classList.remove('guardar-cliente');
                        e.target.classList.add('editar-cliente');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    mostrarMensaje('Error al actualizar el cliente', 'error');
                });
            }
        });
    }

    // Añadir nuevo centro
    const btnAñadirCentro = document.getElementById('añadirCentro');
    if (btnAñadirCentro) {
        btnAñadirCentro.addEventListener('click', function() {
            const centro = {
                ClienteID: clienteSelect.value,
                NombreCentro: document.getElementById('nombreCentro').value,
                NombrePonton: document.getElementById('nombrePonton').value,
                SistemaID: sistemaAlimentacion.value,
                VersionSistema: document.getElementById('versionSistema').value,
                FechaInstalacionACA: document.getElementById('fechaInstalacionACA').value,
                FechaTermino: document.getElementById('fechaTermino').value || null
            };

            if (!centro.ClienteID || !centro.NombreCentro) {
                mostrarMensaje('El cliente y el nombre del centro son obligatorios', 'error');
                return;
            }

            fetch('/api/centros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(centro)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    mostrarMensaje(data.error, 'error');
                } else {
                    mostrarMensaje(`Centro ${centro.NombreCentro} añadido con éxito`);
                    document.getElementById('centroForm').reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarMensaje('Error al añadir el centro', 'error');
            });
        });
    }

    // Cargar centros para gestión
    const btnCargarCentros = document.getElementById('cargarCentros');
    if (btnCargarCentros) {
        btnCargarCentros.addEventListener('click', function() {
            const clienteId = clienteGestion.value;
            if (!clienteId) {
                mostrarMensaje('Por favor, seleccione un cliente', 'error');
                return;
            }
            cargarCentros(clienteId);
        });
    }

    function cargarCentros(clienteId) {
        fetch(`/api/centros/${clienteId}`)
            .then(response => response.json())
            .then(centros => {
                const tabla = document.getElementById('centrosTabla');
                const tbody = tabla.querySelector('tbody');
                tbody.innerHTML = '';
                centros.forEach(centro => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${centro.NombreCliente}</td>
                        <td>${centro.NombreCentro}</td>
                        <td>${centro.NombrePonton || ''}</td>
                        <td>${centro.NombreSistema}</td>
                        <td>${centro.VersionSistema || ''}</td>
                        <td>${formatDate(centro.FechaInstalacionACA)}</td>
                        <td>${formatDate(centro.FechaTermino)}</td>
                        <td>
                            <button class="editar-centro" data-id="${centro.CentroID}">Editar</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                tabla.style.display = 'table';
            })
            .catch(error => {
                console.error('Error al cargar centros:', error);
                mostrarMensaje('Error al cargar los centros', 'error');
            });
    }

    // Edición de centros
    const centrosTabla = document.getElementById('centrosTabla');
    if (centrosTabla) {
        centrosTabla.addEventListener('click', function(e) {
            if (e.target.classList.contains('editar-centro')) {
                const centroId = e.target.dataset.id;
                const row = e.target.closest('tr');
                const cells = row.cells;
                
                row.dataset.originalFechaInstalacion = cells[5].textContent.trim();
                row.dataset.originalFechaTermino = cells[6].textContent.trim();

                // No editamos la columna del cliente (cells[0])
                cells[1].innerHTML = `<input type="text" value="${cells[1].textContent}">`;
                cells[2].innerHTML = `<input type="text" value="${cells[2].textContent}">`;

                const sistemaActual = cells[3].textContent;
                cells[3].innerHTML = sistemaAlimentacion.outerHTML;
                cells[3].querySelector('select').value = Array.from(cells[3].querySelector('select').options)
                    .find(option => option.text === sistemaActual)?.value || '';
                
                cells[4].innerHTML = `<input type="text" value="${cells[4].textContent}">`;
                cells[5].innerHTML = `<input type="date" value="${formatDateForInput(cells[5].textContent)}">`;
                cells[6].innerHTML = `<input type="date" value="${formatDateForInput(cells[6].textContent)}">`;
                
                e.target.textContent = 'Guardar';
                e.target.classList.remove('editar-centro');
                e.target.classList.add('guardar-centro');
            } else if (e.target.classList.contains('guardar-centro')) {
                const centroId = e.target.dataset.id;
                const row = e.target.closest('tr');
                const cells = row.cells;

                const fechaInstInput = cells[5].querySelector('input');
                const fechaTermInput = cells[6].querySelector('input');

                const centroActualizado = {
                    NombreCentro: cells[1].querySelector('input').value,
                    NombrePonton: cells[2].querySelector('input').value,
                    SistemaID: cells[3].querySelector('select').value,
                    VersionSistema: cells[4].querySelector('input').value,
                    FechaInstalacionACA: fechaInstInput.value || null,
                    FechaTermino: fechaTermInput.value || null
                };

                fetch(`/api/centros/${centroId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(centroActualizado)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        mostrarMensaje(data.error, 'error');
                    } else {
                        mostrarMensaje('Centro actualizado con éxito');
                        // Mantener la columna del cliente sin cambios
                        cells[1].textContent = centroActualizado.NombreCentro;
                        cells[2].textContent = centroActualizado.NombrePonton;
                        cells[3].textContent = cells[3].querySelector('select').options[cells[3].querySelector('select').selectedIndex].text;
                        cells[4].textContent = centroActualizado.VersionSistema;
                        cells[5].textContent = fechaInstInput.value ? formatDate(fechaInstInput.value) : '';
                        cells[6].textContent = fechaTermInput.value ? formatDate(fechaTermInput.value) : '';

                        e.target.textContent = 'Editar';
                        e.target.classList.remove('guardar-centro');
                        e.target.classList.add('editar-centro');
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar centro:', error);
                    mostrarMensaje('Error al actualizar el centro', 'error');
                });
            }
        });
    }

    // Cargar estado mensual
    const btnCargarEstadoMensual = document.getElementById('cargarEstadoMensual');
    if (btnCargarEstadoMensual) {
        btnCargarEstadoMensual.addEventListener('click', function() {
            const clienteId = clienteEstadoMensual.value;
            const año = añoEstadoMensual.value;
            const mes = mesEstadoMensual.value;
            
            if (!clienteId || !año || !mes) {
                mostrarMensaje('Por favor, seleccione cliente, año y mes', 'error');
                return;
            }

            fetch(`/api/estado-mensual?clienteId=${clienteId}&año=${año}&mes=${mes}`)
                .then(response => response.json())
                .then(estados => {
                    const tabla = document.getElementById('estadoMensualTabla');
                    const tbody = tabla.querySelector('tbody');
                    tbody.innerHTML = '';
                    estados.forEach(estado => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${estado.NombreCliente}</td>
                            <td>${estado.NombreCentro}</td>
                            <td>${estado.NombrePonton || ''}</td>
                            <td>
                                <select class="sistema-select" data-centro-id="${estado.CentroID}">
                                    ${sistemaAlimentacion.innerHTML}
                                </select>
                            </td>
                            <td>
                                <input type="text" class="version-sistema" value="${estado.VersionSistemaMensual || estado.VersionSistema || ''}" placeholder="Versión del sistema">
                            </td>
                            <td>${formatDateEstadoMensual(estado.FechaInstalacionACA)}</td>
                            <td>${formatDateEstadoMensual(estado.FechaTermino)}</td>
                            <td>
                                <select class="estado-select" data-centro-id="${estado.CentroID}">
                                    <option value="1" ${estado.EstadoID === 1 ? 'selected' : ''}>Integrando</option>
                                    <option value="2" ${estado.EstadoID === 2 ? 'selected' : ''}>No Integrando</option>
                                    <option value="3" ${estado.EstadoID === 3 ? 'selected' : ''}>Centro Vacío</option>
                                </select>
                            </td>
                            <td>
                                <input type="checkbox" class="analytics-check" data-centro-id="${estado.CentroID}" ${estado.CentroConAnalytics ? 'checked' : ''}>
                            </td>
                            <td>
                                <textarea class="comentarios" data-centro-id="${estado.CentroID}">${estado.Comentarios || ''}</textarea>
                            </td>
                        `;
                        tbody.appendChild(tr);
                        
                        // Establecer el sistema de alimentación seleccionado
                        const sistemaSelect = tr.querySelector('.sistema-select');
                        sistemaSelect.value = estado.SistemaIDMensual || estado.SistemaID;
                    });
                    tabla.style.display = 'table';
                    document.getElementById('guardarEstadoMensual').style.display = 'block';
                    actualizarResumenCentros();
                })
                .catch(error => {
                    console.error('Error al cargar estado mensual:', error);
                    mostrarMensaje('Error al cargar el estado mensual', 'error');
                });
        });
    }

    // Actualizar resumen cuando cambie el estado o analytics
    const estadoMensualTabla = document.getElementById('estadoMensualTabla');
    if (estadoMensualTabla) {
        estadoMensualTabla.addEventListener('change', function(e) {
            if (e.target.classList.contains('estado-select') || 
                e.target.classList.contains('analytics-check') ||
                e.target.classList.contains('sistema-select')) {
                actualizarResumenCentros();
            }
        });
    }

    // Guardar estado mensual
    const btnGuardarEstadoMensual = document.getElementById('guardarEstadoMensual');
    if (btnGuardarEstadoMensual) {
        btnGuardarEstadoMensual.addEventListener('click', function() {
            const clienteId = clienteEstadoMensual.value;
            const año = añoEstadoMensual.value;
            const mes = mesEstadoMensual.value;
            const estados = [];

            document.querySelectorAll('#estadoMensualTabla tbody tr').forEach(tr => {
                const centroId = tr.querySelector('.estado-select').dataset.centroId;
                estados.push({
                    CentroID: centroId,
                    Año: año,
                    Mes: mes,
                    EstadoID: tr.querySelector('.estado-select').value,
                    CentroConAnalytics: tr.querySelector('.analytics-check').checked,
                    Comentarios: tr.querySelector('.comentarios').value,
                    SistemaID: tr.querySelector('.sistema-select').value,
                    VersionSistema: tr.querySelector('.version-sistema').value
                });
            });

            fetch('/api/estado-mensual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(estados)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    mostrarMensaje(data.error, 'error');
                } else {
                    mostrarMensaje('Estados mensuales actualizados con éxito');
                    actualizarResumenCentros();
                }
            })
            .catch(error => {
                console.error('Error al guardar estados mensuales:', error);
                mostrarMensaje('Error al guardar los estados mensuales', 'error');
            });
        });
    }

    // Función para formatear fechas
    function formatDate(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }

    // Función para formatear fechas para input
    function formatDateForInput(dateString) {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }

    // Función específica para formatear fechas en estado mensual
    function formatDateEstadoMensual(dateString) {
        if (!dateString) return '';
        if (dateString.includes('T')) {
            dateString = dateString.split('T')[0];
        }
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }

    // Inicialización
    cargarClientes();
    cargarAños();
    cargarSistemasAlimentacion();
});