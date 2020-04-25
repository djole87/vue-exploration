export function createRepositoryStats(technicalName, repoName, statistics) {
    // ============= Time Distribution Charts ===============
    let timeDistributionCharts = prepareGlobalTimeDistribution(statistics, technicalName)

    // ============== Global Pie Charts =====================
    let globalPiecharts = prepareGlobalPieCharts(
        technicalName + '_countPerState',
        '# per State',
        statistics.countPerState,
        n => {
            switch (n) {
                case 'running':
                case 'waiting':
                case 'enqueued':
                case 'pending':
                    return 'waiting'
                case 'done':
                    return 'done'
                case 'panic':
                    return 'panic'
                default:
                    return 'other'
            }
        },
        n => {
            switch (n) {
                case 'running':
                case 'waiting':
                case 'enqueued':
                case 'pending':
                    return 'rgba(249, 214, 40, 0.2)'
                case 'done':
                    return 'rgba(58, 229, 39, 0.2)'
                case 'panic':
                    return 'rgba(232, 39, 52, 0.2)'
                default:
                    return 'rgba(203, 203, 203, 0.2)'
            }
        }
    )

    return {
        repoName: repoName,
        timeDistributionCharts: timeDistributionCharts.timeDistributionCharts,
        timeDistributionChartsPanic: timeDistributionCharts.timeDistributionPanicCharts,
        piecharts: globalPiecharts,
        // ============== Top Lists =====================
        topLists: prepareTopLists(statistics),
        // ============== Job Details ===================
        jobDetails: prepareJobDetails(statistics)
    }
}

export function createIndividualRepositoryStats(statistics) {
    let individualNames = new Map()
    let individualTechnicalNames = []
    let individualStatsMap = new Map()
    let statsMap = new Map()

    statistics.individualStatistics.toArray().forEach(element => {
        let tecName = element.repositoryTechnicalName
        individualTechnicalNames.push(tecName)
        individualNames.set(tecName, element.repositoryName)
        individualStatsMap.set(tecName, element)
    })

    individualTechnicalNames.forEach(tecName => {
        let repoName = individualNames.get(tecName)
        let individualRepresentationJobStats = individualStatsMap.get(tecName)
        let canvasPrefix = createVariableName(tecName)
        let individualStats = createRepositoryStats(canvasPrefix, repoName, individualRepresentationJobStats)
        statsMap.set(tecName, individualStats)
    })

    return {
        individualTechnicalNames: individualTechnicalNames.sort(),
        statsMap: statsMap
    }
}

let count = 0

function createVariableName(technicalName) {
    if (technicalName) {
        let chars = Array.from(technicalName)
        let cleanChars = []

        chars.forEach(char => {
            if (!alphanumeric(char)) char = '_'
            cleanChars.push(char)
        })

        technicalName = cleanChars.join('') + '_' + count
    }

    return technicalName
}

// function logMapElements(value, key) {
//     console.log(`m[${key}] = ${value}`)
// }

function prepareGlobalTimeDistribution(statistics, technicalName) {
    const dataSetLabels = ['Last 20 min', 'Last 24 hours', 'Last 15 days', 'Last 12 Months']

    const distributionProps = [
        'lastHourDistribution',
        'lastDayDistribution',
        'lastMonthDistribution',
        'lastYearDistribution'
    ]

    const distributionPropsPanic = [
        'lastHourPanicDistribution',
        'lastDayPanicDistribution',
        'lastMonthPanicDistribution',
        'lastYearPanicDistribution'
    ]

    const labels = [20, 24, 15, 12]
    const maximums = [60, 24, 31, 12]

    let timeDistributionCharts = []
    let timeDistributionChartsPanic = []

    dataSetLabels.forEach((dataSetLabel, index) => {
        let base = index < 2 ? 0 : 1
        let res = createTimeDistributionChart(
            technicalName + '_' + distributionProps[index],
            dataSetLabel,
            pickDataValues(statistics[distributionProps[index]].counts.toArray(), labels[index]),
            createLabels(base, maximums[index], statistics[distributionProps[index]].currentTime, labels[index])
        )

        timeDistributionCharts.push(res)
    })

    dataSetLabels.forEach((dataSetLabel, index) => {
        let base = index < 2 ? 0 : 1
        let res = createTimeDistributionChart(
            technicalName + '_' + distributionPropsPanic[index],
            dataSetLabel,
            pickDataValues(statistics[distributionPropsPanic[index]].counts.toArray(), labels[index]),
            createLabels(base, maximums[index], statistics[distributionPropsPanic[index]].currentTime, labels[index])
        )

        timeDistributionChartsPanic.push(res)
    })

    return {
        timeDistributionCharts: timeDistributionCharts,
        timeDistributionPanicCharts: timeDistributionChartsPanic
    }
}

function prepareTopLists(statistics) {
    const topListLabels = ['Top Users (Total)', 'Top Users (Panic)', 'Top Addresses (Total)', 'Top Addresses (Panic)']
    const topListProps = ['jobCountPerUser', 'jobPanicCountPerUser', 'jobCountPerAddress', 'jobPanicCountPerAddress']
    const headers = [
        [
            { label: 'User', prop: 'value', sortable: true },
            { label: 'Job Count', prop: 'key', sortable: true }
        ],
        [
            { label: 'User', prop: 'value', sortable: true },
            { label: 'Job Panic Count', prop: 'key', sortable: true }
        ],
        [
            { label: 'Address', prop: 'value', sortable: false },
            { label: 'Job Count', prop: 'key', sortable: true }
        ],
        [
            { label: 'Address', prop: 'value', sortable: false },
            { label: 'Job Panic Count', prop: 'key', sortable: true }
        ]
    ]
    let topLists = []

    topListLabels.forEach((label, index) => {
        topLists.push(createTopListData(label, statistics[topListProps[index]], headers[index]))
    })

    return topLists
}

function prepareGlobalPieCharts(id, datasetLabel, valueMap, namingFunction, coloringFunction) {
    let piecharts = []

    let values = []
    let labels = []
    let colors = []

    valueMap.forEach((key, value) => {
        let name = key
        let translatedName = namingFunction(name)
        if (translatedName && value && value > 0) {
            labels.push(name)
            values.push(value)
            let color = coloringFunction(name)
            if (color) colors.push(color)
        }
    })

    piecharts.push(createPieChart(id, datasetLabel, values, labels, colors))
    return piecharts
}

function alphanumeric(characters) {
    let letters = /^[0-9a-zA-Z]+$/
    return characters.valueOf().match(letters)
}

function prepareJobDetails(statistics) {
    const jobDetailsLabels = ['Running', 'Pending', 'Panic', 'Done']
    const jobDetailsProps = ['latestRunningJobs', 'latestPendingJobs', 'latestPanicJobs', 'latestDoneJobs']
    const headers = [
        { label: 'Job Id', prop: 'jobId', sortable: false },
        { label: 'Conversion Type', prop: 'conversionType', sortable: true },
        { label: 'Start Date', prop: 'startTimestamp', sortable: true },
        { label: 'Filename', prop: 'displayFilename', sortable: true },
        { label: 'User', prop: 'clientUsername', sortable: true },
        { label: 'Duration', prop: 'duration', sortable: true }
    ]

    let allJobDetails = []

    jobDetailsLabels.forEach((label, index) => {
        allJobDetails.push(createJobDetailsData(label, statistics[jobDetailsProps[index]].toArray(), headers))
    })
    return allJobDetails
}

function createJobDetailsData(label, jobDetailsList, headers) {
    return {
        label: label,
        data: jobDetailsList,
        headers: headers
    }
}

// TODO replace all create charts methods with the uniform one
// consider multiple datasets
function createPieChart(id, datasetLabel, data, labels, colors) {
    // add colors to data sets
    return {
        id: id,
        datasetLabel: datasetLabel,
        data: data,
        labels: labels,
        colors: colors
    }
}

function createTimeDistributionChart(canvasId, datasetLabel, data, labels) {
    return {
        id: canvasId,
        datasetLabel: datasetLabel,
        data: data,
        labels: labels
    }
}

function createTopListData(datasetLabel, dataMap, headers) {
    let unsortedMap = new Map()
    if (dataMap.size() > 0) {
        dataMap.forEach((key, value) => {
            let name = key
            let count = value

            let list = null
            if (name) {
                if (unsortedMap.has(count)) {
                    list = unsortedMap.get(count)
                } else {
                    list = new Set()
                    unsortedMap.set(count, list)
                }
                list.add(name)
            }
        })
    }

    let topData = []
    let mapKeys = unsortedMap.keys()
    Array.from(mapKeys).forEach(key => {
        let names = unsortedMap.get(key)
        let namesString = Array.from(names).join(', ')

        let obj = {
            key: key.valueOf(),
            value: namesString
        }
        topData.push(obj)
    })

    return createTopList(datasetLabel, topData, headers)
}

function createTopList(label, data, headers) {
    return {
        label: label,
        data: data,
        headers: headers
    }
}

function createLabels(base, range, endWith, max) {
    const start = endWith - max + 1
    let labels = []
    if (start >= base) {
        for (let i = start; i <= endWith; i++) labels.push(i)
    } else {
        for (let i = range + start + base; i <= range - 1 + base; ++i) labels.push(i)
        for (let i = base; i <= endWith + base; ++i) {
            labels.push(i)
        }
    }

    return labels
}

function pickDataValues(jobDistributionValues, max) {
    const start = jobDistributionValues.length - max
    return jobDistributionValues.splice(start)
}
