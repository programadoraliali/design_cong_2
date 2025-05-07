document.addEventListener('DOMContentLoaded', function () {
    // --- Elementos do DOM ---
    const selectMonth = document.getElementById('select_month');
    const selectYear = document.getElementById('select_year');
    const loadDatesBtn = document.getElementById('loadDatesBtn');
    const designacoesContainer = document.getElementById('designacoes-container');
    const reuniaoPublicaContainer = document.getElementById('reuniao-publica-container');
    const limpezaAposReuniaoContainer = document.getElementById('limpeza-apos-reuniao-container');
    const limpezaSemanalContainer = document.getElementById('limpeza-semanal-container');

    // --- Lista de Grupos para Limpeza ---
    const gruposLimpeza = [
        "Grupo 1 - Luiz Aguinaldo",
        "Grupo 2 - Marcos Camillo",
        "Grupo 3 - Angelo Berben",
        "Grupo 4 - Marcelo Teixeira",
        "Grupo 5 - Tai Lee",
        "Grupo 6 - Marco Saudo"
    ];

    // --- Inicialização ---
    const today = new Date();
    selectMonth.value = today.getMonth(); 
    selectYear.value = today.getFullYear();


    // --- Funções Auxiliares para Criação de HTML Dinâmico ---
    function appendLabelAndInput(wrapper, field, idPrefix, dateIdSuffix, customLabels = {}) {
        const label = document.createElement('label');
        const inputId = `${idPrefix}_${field}_${dateIdSuffix}`;
        label.htmlFor = inputId;
        label.textContent = customLabels[field] || field.charAt(0).toUpperCase() + field.slice(1) + ':';

        let inputElement;

        if (field === 'grupo' && idPrefix === 't3') {
            inputElement = document.createElement('select');
            inputElement.id = inputId;
            inputElement.name = inputId;
            inputElement.dataset.field = field;

            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "Selecione um grupo...";
            inputElement.appendChild(defaultOption);

            gruposLimpeza.forEach(grupoText => {
                const option = document.createElement('option');
                option.value = grupoText;
                option.textContent = grupoText;
                inputElement.appendChild(option);
            });
        } else {
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.id = inputId;
            inputElement.name = inputId;
            inputElement.dataset.field = field;
        }

        wrapper.appendChild(label);
        wrapper.appendChild(inputElement);
    }

    function createDynamicRow(formattedDate, dateIdSuffix, fields, idPrefix, customLabels = {}) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('dynamic-row');
        rowDiv.dataset.formattedDate = formattedDate;

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('dynamic-date');
        dateSpan.textContent = formattedDate;

        const inputsContainer = document.createElement('div');
        inputsContainer.classList.add('dynamic-inputs-container');

        if (idPrefix === 't2' && fields.includes('tema')) {
            const temaField = 'tema';
            const temaWrapper = document.createElement('div');
            temaWrapper.classList.add('input-wrapper', 'tema-wrapper');
            appendLabelAndInput(temaWrapper, temaField, idPrefix, dateIdSuffix, customLabels);
            inputsContainer.appendChild(temaWrapper);

            const otherInputsRow = document.createElement('div');
            otherInputsRow.classList.add('inputs-row');
            const otherFields = fields.filter(f => f !== temaField);
            otherFields.forEach(field => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('input-wrapper');
                appendLabelAndInput(wrapper, field, idPrefix, dateIdSuffix, customLabels);
                otherInputsRow.appendChild(wrapper);
            });
            inputsContainer.appendChild(otherInputsRow);
        } else {
            const inputsRow = document.createElement('div');
            inputsRow.classList.add('inputs-row');
            if (idPrefix === 't3' || idPrefix === 't4') {
                inputsRow.classList.add('limpeza-inputs');
            }
            fields.forEach(field => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('input-wrapper');
                appendLabelAndInput(wrapper, field, idPrefix, dateIdSuffix, customLabels);
                inputsRow.appendChild(wrapper);
            });
            inputsContainer.appendChild(inputsRow);
        }
        rowDiv.appendChild(dateSpan);
        rowDiv.appendChild(inputsContainer);
        return rowDiv;
    }

    function populateTablesByDate() {
        const month = parseInt(selectMonth.value); 
        const year = parseInt(selectYear.value);

        if (isNaN(year) || year < 1900 || year > 2100) { alert("Ano inválido."); return; }
        if (isNaN(month) || month < 0 || month > 11) { alert("Mês inválido."); return; }

        designacoesContainer.innerHTML = '';
        reuniaoPublicaContainer.innerHTML = '';
        limpezaAposReuniaoContainer.innerHTML = '';
        limpezaSemanalContainer.innerHTML = '';

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        let foundT1Dates = false, foundT2Dates = false, foundT3Dates = false, foundT4Dates = false;

        for (let day = 1; day <= daysInMonth; day++) {
            try {
                const currentDate = new Date(year, month, day);
                const dayOfWeek = currentDate.getDay(); 
                const formattedDateWithDayOfWeek = `${diasSemana[dayOfWeek]} ${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}`;
                const dateIdSuffix = `${year}${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

                if (dayOfWeek === 0 || dayOfWeek === 4) { 
                    foundT1Dates = true;
                    const fieldsT1 = ['av', 'backup', 'zoom'];
                    designacoesContainer.appendChild(createDynamicRow(formattedDateWithDayOfWeek, dateIdSuffix, fieldsT1, 't1'));

                    foundT3Dates = true;
                    const fieldsT3 = ['grupo'];
                    const labelsT3 = { grupo: 'Grupo Responsável:' };
                    limpezaAposReuniaoContainer.appendChild(createDynamicRow(formattedDateWithDayOfWeek, dateIdSuffix, fieldsT3, 't3', labelsT3));
                }
                if (dayOfWeek === 0) { 
                    foundT2Dates = true;
                    const fieldsT2 = ['tema', 'orador', 'congregacao', 'dirigente'];
                    const labelsT2 = { dirigente: 'Dirigente de A Sentinela', congregacao: 'Congregação' };
                    reuniaoPublicaContainer.appendChild(createDynamicRow(formattedDateWithDayOfWeek, dateIdSuffix, fieldsT2, 't2', labelsT2));
                }
                if (dayOfWeek === 1) { 
                    foundT4Dates = true;
                    const fieldsT4 = ['responsavel'];
                    const labelsT4 = { responsavel: 'Responsável (Congregação/Grupo):' };
                    const justDatePartForT4 = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}`;
                    limpezaSemanalContainer.appendChild(createDynamicRow(justDatePartForT4, dateIdSuffix, fieldsT4, 't4', labelsT4));
                }
            } catch (e) {
                console.error(`Erro ao processar dia ${day}/${month + 1}/${year}:`, e);
            }
        }

        if (!foundT1Dates) designacoesContainer.innerHTML = '<p><em>Nenhuma quinta-feira ou domingo encontrado neste mês.</em></p>';
        if (!foundT2Dates) reuniaoPublicaContainer.innerHTML = '<p><em>Nenhum domingo encontrado para Reunião Pública.</em></p>';
        if (!foundT3Dates) limpezaAposReuniaoContainer.innerHTML = '<p><em>Nenhuma quinta-feira ou domingo encontrado para Limpeza Pós-Reunião.</em></p>';
        if (!foundT4Dates) limpezaSemanalContainer.innerHTML = '<p><em>Nenhuma segunda-feira encontrada para Limpeza Semanal.</em></p>';
    }

    function addTableToPdf(doc, startY, containerElement, sectionTitle, headers, fieldOrder, options = {}) {
        const {
            rowSpanLogic = false,
            columnStyles: customColumnStyles = {},
            isCustomZebraTable = false, 
            tableWidthOverride,
            startX_Override,
            pageUtils 
        } = options;

        const { pageMargin, pageHeight, sectionTitleFontSize, tableBodyFontSize, spaceBelowSectionTitle, spaceAfterTable, headerFillColor, whiteColor, lightGray, tableHeadFontSize, tableHeadCellPadding, tableBodyCellPadding, pageContentWidth } = pageUtils;
        
        let yPos = startY; 
        let newPageAddedByThisFunction = false;
        
        const bodyData = [];
        const dynamicRows = containerElement.querySelectorAll('.dynamic-row');
        const sectionTitleX = startX_Override || pageMargin; 

        if (dynamicRows.length === 0 || (dynamicRows.length === 1 && dynamicRows[0].querySelector('p em'))) {
            doc.setFontSize(sectionTitleFontSize); 
            doc.setTextColor(40);
            doc.setFont(undefined, 'bold');
            const sectionTitleTextIfEmpty = sectionTitle.toUpperCase();
            const titleHeight = doc.getTextDimensions(sectionTitleTextIfEmpty, { fontSize: sectionTitleFontSize, fontStyle: 'bold' }).h;
            const emptyMsgText = "Nenhum dado preenchido para este período.";
            const emptyMsgHeight = doc.getTextDimensions(emptyMsgText, { fontSize: tableBodyFontSize - 1 }).h;

            if (yPos + titleHeight + spaceBelowSectionTitle + emptyMsgHeight > pageHeight - pageMargin) {
                doc.addPage();
                yPos = pageMargin;
                newPageAddedByThisFunction = true;
            }
            
            doc.text(sectionTitleTextIfEmpty, sectionTitleX, yPos, { baseline: 'top' }); 
            yPos += titleHeight + spaceBelowSectionTitle;

            doc.setFontSize(tableBodyFontSize - 1);
            doc.setTextColor(100);
            doc.setFont(undefined, 'normal');
            doc.text(emptyMsgText, sectionTitleX, yPos); 
            yPos += emptyMsgHeight;
            doc.setTextColor(0);
            
            return { finalY: yPos, endPage: doc.internal.getCurrentPageInfo().pageNumber, newPageAdded: newPageAddedByThisFunction };
        }

        let itemIndexForZebra = 0;
        dynamicRows.forEach(rowEl => {
            const dateText = rowEl.querySelector('.dynamic-date').textContent;
            const inputs = rowEl.querySelectorAll('input[type="text"], select');
            const inputValues = {}; 
            inputs.forEach(input => { inputValues[input.dataset.field] = input.value || ''; });

            if (rowSpanLogic && containerElement.id === 'reuniao-publica-container') {
                const temaValue = inputValues['tema'] || '';
                const oradorValue = inputValues['orador'] || '';
                const congValue = inputValues['congregacao'] || '';
                const dirigenteValue = inputValues['dirigente'] || '';
                const currentItemFillColor = itemIndexForZebra % 2 === 0 ? whiteColor : lightGray;
                const row1 = [
                    { content: dateText, rowSpan: 2, styles: { valign: 'middle', halign: 'center', fillColor: currentItemFillColor } },
                    { content: `Tema: ${temaValue}`, colSpan: 3, styles: { valign: 'middle', fontStyle: 'italic', fillColor: currentItemFillColor, halign: 'center' } },
                    null, null 
                ];
                const row2 = [ 
                    { content: oradorValue, styles: { valign: 'middle', fillColor: currentItemFillColor, halign: 'center' } },
                    { content: congValue, styles: { valign: 'middle', fillColor: currentItemFillColor, halign: 'center' } },
                    { content: dirigenteValue, styles: { valign: 'middle', fillColor: currentItemFillColor, halign: 'center' } }
                ];
                bodyData.push(row1); bodyData.push(row2);
                itemIndexForZebra++;
            } else {
                const rowDataArray = [dateText];
                fieldOrder.forEach(field => { rowDataArray.push(inputValues[field] || ''); });
                bodyData.push(rowDataArray);
            }
        });
        
        doc.setFontSize(sectionTitleFontSize);
        doc.setTextColor(40);
        doc.setFont(undefined, 'bold');
        const sectionTitleText = sectionTitle.toUpperCase();
        const sectionTitleHeight = doc.getTextDimensions(sectionTitleText, { fontSize: sectionTitleFontSize, fontStyle: 'bold' }).h;
        
        // A AutoTable começará em autoTableStartY. 
        // Se yPos (onde o título é desenhado) estiver muito baixo,
        // autoTableStartY também estará, e a AutoTable deve adicionar a página, se necessário.
        // Não adicionamos página manualmente aqui se a tabela tiver dados, confiamos na AutoTable.
        doc.text(sectionTitleText, sectionTitleX, yPos, { baseline: 'top' }); 
        let autoTableStartY = yPos + sectionTitleHeight + spaceBelowSectionTitle;
        doc.setFont(undefined, 'normal');

        const autoTableOptions = {
            startY: autoTableStartY,
            head: headers,
            body: bodyData,
            theme: 'grid',
            headStyles: {
                fillColor: headerFillColor, textColor: 255, fontStyle: 'bold',
                fontSize: tableHeadFontSize, cellPadding: tableHeadCellPadding, // Ajustado para tableHeadCellPadding
                halign: 'center'
            },
            styles: { 
                fontSize: tableBodyFontSize, cellPadding: tableBodyCellPadding, // Ajustado para tableBodyCellPadding
                valign: 'middle', halign: 'center', fillColor: whiteColor 
            },
            alternateRowStyles: { fillColor: lightGray },
            columnStyles: customColumnStyles,
            margin: { left: startX_Override || pageMargin },
            // REMOVIDO: tableLineColor e tableLineWidth para usar o padrão do tema 'grid'
        };
        
        if (tableWidthOverride) autoTableOptions.tableWidth = tableWidthOverride;
        else autoTableOptions.tableWidth = pageContentWidth;

        if (isCustomZebraTable) { 
            delete autoTableOptions.styles.fillColor;
            delete autoTableOptions.alternateRowStyles;
        }
        
        let pageBeforeAutoTable = doc.internal.getCurrentPageInfo().pageNumber;
        doc.autoTable(autoTableOptions);
        let pageAfterAutoTable = doc.internal.getCurrentPageInfo().pageNumber;

        if (pageAfterAutoTable > pageBeforeAutoTable) {
            newPageAddedByThisFunction = true;
        }
        
        return { finalY: doc.previousAutoTable.finalY, endPage: pageAfterAutoTable, newPageAdded: newPageAddedByThisFunction };
    }


    function gerarPDFComAutotable() {
        console.log("Iniciando gerarPDFComAutotable...");
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const selectedMonthIndex = parseInt(selectMonth.value);
        const selectedYear = parseInt(selectYear.value);
        const selectedMonthName = monthNames[selectedMonthIndex];

        const docTitle = `Designações para ${selectedMonthName} de ${selectedYear}`;
        const fileName = `Designacoes_${selectedMonthName}_${selectedYear}.pdf`;

        const pageMargin = 10;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height; 
        const pageContentWidth = pageWidth - (pageMargin * 2);

        const headerFillColor = [164, 85, 51]; 
        const whiteColor = [255, 255, 255];    
        const lightGray = [245, 245, 245];     
        
        const dataColumnWidth = 24;            
        const dataColumnWidthShort = 15;       

        const titleStripHeight = 14;
        const mainTitleFontSize = 16;

        const spaceAfterMainTitleStrip = 10;
        const spaceBelowSectionTitle = 2; // Mantido
        const spaceAfterTable = 7; // Reduzido de 8 para 7

        const sectionTitleFontSize = 11;
        const tableHeadFontSize = 9;
        const tableHeadCellPadding = 1.3; // Reduzido de 1.5 para 1.3
        const tableBodyFontSize = 9;
        const tableBodyCellPadding = 1.8; // Reduzido de 2 para 1.8

        const pageUtils = { pageMargin, pageHeight, sectionTitleFontSize, tableBodyFontSize, spaceBelowSectionTitle, spaceAfterTable, headerFillColor, whiteColor, lightGray, tableHeadFontSize, tableHeadCellPadding, tableBodyCellPadding, pageContentWidth };

        doc.setFillColor(headerFillColor[0], headerFillColor[1], headerFillColor[2]);
        doc.rect(0, 0, pageWidth, titleStripHeight, 'F');
        doc.setFontSize(mainTitleFontSize);
        doc.setTextColor(255, 255, 255);
        doc.text(docTitle, pageWidth / 2, titleStripHeight / 2, { 
            align: 'center',
            baseline: 'middle'
        });
        doc.setTextColor(0, 0, 0);

        let currentTableStartYGlobal = titleStripHeight + spaceAfterMainTitleStrip; 

        // --- Tabela 1 ---
        const t1_legend = document.querySelector('#fs-designacoes legend').textContent;
        const t1_headers = [['Data', 'AV', 'Backup', 'Zoom']];
        const t1_fields = ['av', 'backup', 'zoom'];
        const t1_colWidth_content = Math.floor((pageContentWidth - dataColumnWidth) / 3);
        const t1_colStyles = { 
            0: { cellWidth: dataColumnWidth, halign: 'center' }, 
            1: { cellWidth: t1_colWidth_content },
            2: { cellWidth: t1_colWidth_content },
            3: { cellWidth: pageContentWidth - dataColumnWidth - 2 * t1_colWidth_content } 
        };
        let t1Result = addTableToPdf(doc, currentTableStartYGlobal, designacoesContainer, t1_legend, t1_headers, t1_fields, { columnStyles: t1_colStyles, pageUtils });
        currentTableStartYGlobal = t1Result.finalY + spaceAfterTable;
      
        // --- Tabela 2 ---
        const t2_legend = document.querySelector('#fs-reuniao-publica legend').textContent;
        const t2_headers = [['Data', 'Orador', 'Congregação', 'Dirigente de A Sentinela']];
        const t2_fields = ['tema', 'orador', 'congregacao', 'dirigente']; 
        const remainingWidthT2 = pageContentWidth - dataColumnWidth;
        const numContentColsT2 = 3;
        const colWidthT2_ContentBase = Math.floor(remainingWidthT2 / numContentColsT2);
        const t2_colStyles = {
            0: { cellWidth: dataColumnWidth, halign: 'center' },
            1: { cellWidth: colWidthT2_ContentBase },
            2: { cellWidth: colWidthT2_ContentBase },
            3: { cellWidth: remainingWidthT2 - (colWidthT2_ContentBase * 2) }
        };
        let t2Result = addTableToPdf(doc, currentTableStartYGlobal, reuniaoPublicaContainer, t2_legend, t2_headers, t2_fields, { 
            rowSpanLogic: true, columnStyles: t2_colStyles, isCustomZebraTable: true, pageUtils 
        });
        currentTableStartYGlobal = t2Result.finalY + spaceAfterTable;

        // --- Bloco T3 e T4 lado a lado ---
        const tableSpacingSideBySide = 4;
        const tableWidthT3 = Math.floor((pageContentWidth - tableSpacingSideBySide) / 2);
        const tableWidthT4 = pageContentWidth - tableWidthT3 - tableSpacingSideBySide; 
        const startX_T4 = pageMargin + tableWidthT3 + tableSpacingSideBySide;

        let yPosForSideBySideBlock = currentTableStartYGlobal; 
        let t3Result_side, t4Result_side;

        // Tabela 3
        const t3_legend = document.querySelector('#fs-limpeza-reuniao legend').textContent;
        const t3_headers = [['Data', 'Grupo Responsável']];
        const t3_fields = ['grupo'];
        const t3_colStyles = { 
            0: { cellWidth: dataColumnWidth, halign: 'center' }, 
            1: { cellWidth: tableWidthT3 - dataColumnWidth }
        };
        t3Result_side = addTableToPdf(doc, yPosForSideBySideBlock, limpezaAposReuniaoContainer, t3_legend, t3_headers, t3_fields, { 
            columnStyles: t3_colStyles, tableWidthOverride: tableWidthT3, pageUtils 
        });

        // Tabela 4
        const t4_legend = document.querySelector('#fs-limpeza-semanal legend').textContent;
        const t4_headers = [['Semana', 'Responsável']];
        const t4_fields = ['responsavel'];
        const t4_colStyles = { 
            0: { cellWidth: dataColumnWidthShort, halign: 'center' }, 
            1: { cellWidth: tableWidthT4 - dataColumnWidthShort }
        };
        t4Result_side = addTableToPdf(doc, yPosForSideBySideBlock, limpezaSemanalContainer, t4_legend, t4_headers, t4_fields, { 
            columnStyles: t4_colStyles, tableWidthOverride: tableWidthT4, startX_Override: startX_T4, pageUtils 
        });

        if (t3Result_side.endPage > t4Result_side.endPage) {
            currentTableStartYGlobal = t3Result_side.finalY + spaceAfterTable;
        } else if (t4Result_side.endPage > t3Result_side.endPage) {
            currentTableStartYGlobal = t4Result_side.finalY + spaceAfterTable;
        } else { 
            currentTableStartYGlobal = Math.max(t3Result_side.finalY, t4Result_side.finalY) + spaceAfterTable;
        }
        
        doc.save(fileName); 
        console.log(`PDF gerado: ${fileName}`);
    }
    

    // --- Event Listeners ---
    if (loadDatesBtn) loadDatesBtn.addEventListener('click', populateTablesByDate);
    else console.error("Botão 'Carregar Datas' (loadDatesBtn) não encontrado!");
    
    const gerarPdfBtnElement = document.getElementById('gerarPdfBtn');
    if (gerarPdfBtnElement) gerarPdfBtnElement.addEventListener('click', gerarPDFComAutotable);
    else console.error("Botão 'Gerar PDF' (gerarPdfBtn) não encontrado no HTML!");

    try {
        populateTablesByDate(); 
    } catch (e) {
        console.error("Erro ao executar populateTablesByDate na inicialização:", e);
        alert("Ocorreu um erro ao carregar as datas iniciais. Verifique o console (F12).");
    }
});