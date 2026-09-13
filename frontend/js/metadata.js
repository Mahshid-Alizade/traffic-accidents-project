const BASE_URL = "http://localhost:3000";

async function loadMetadata() {

    try {

        const response = await fetch(
            `${BASE_URL}/metadata/datasets`
        );

        const data = await response.json();

        const container =
            document.getElementById(
                "metadata-container"
            );

        container.innerHTML = "";

        Object.values(data).forEach(dataset => {

            container.innerHTML += `
                <div class="metadata-card">

                    <h2>${dataset.dataset}</h2>

                    <p>
                        <strong>Table:</strong>
                        ${dataset.table}
                    </p>

                    <p>
                        <strong>Summary:</strong>
                        ${dataset.summary}
                    </p>

                    <p>
                        <strong>Coverage:</strong>
                        ${dataset.coverage?.from ?? "-"}
                        -
                        ${dataset.coverage?.to ?? "-"}
                    </p>

                    <p>
                        <strong>Primary Key:</strong>
                        ${
                            Array.isArray(dataset.primaryKey)
                                ? dataset.primaryKey.join(", ")
                                : dataset.primaryKey
                        }
                    </p>

                    <p>
                        <strong>Licence:</strong>
                        ${dataset.licence ?? "-"}
                    </p>

                    <p>
                        <strong>Licence URL:</strong>
                        <a href="${dataset.licenceUrl}"
                           target="_blank">
                            View Licence
                        </a>
                    </p>

                    ${
                        dataset.reference
                        ? `
                        <p>
                            <strong>Reference:</strong>
                            ${dataset.reference}
                        </p>
                        `
                        : ""
                    }

                    ${
                        dataset.notes
                        ? `
                        <p>
                            <strong>Notes:</strong>
                        </p>

                        <ul>
                            ${dataset.notes
                                .map(note => `<li>${note}</li>`)
                                .join("")}
                        </ul>
                        `
                        : ""
                    }

                    ${
                        dataset.source
                        ? `
                        <hr>

                        <p>
                            <strong>Source:</strong>
                            ${dataset.source.title}
                        </p>

                        <p>
                            <strong>Organisation:</strong>
                            ${dataset.source.organisation}
                        </p>

                        <p>
                            <strong>Portal:</strong>
                            ${dataset.source.portal}
                        </p>

                        <p>
                            <strong>URL:</strong>
                            <a href="${dataset.source.url}"
                               target="_blank">
                                Open Source
                            </a>
                        </p>
                        `
                        : ""
                    }

                </div>
            `;
        });

    } catch (error) {

        console.error(error);

        alert("Failed to load metadata");

    }
}