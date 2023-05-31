import React, { useState } from 'react'
import _data from './data.json'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

const Item: React.FC<{ name: string, tags: string[] }> = ({ name, tags }) => {
  return <Grid item>
    <Paper sx={{ p: 1 }}>
      <span style={{ fontWeight: 'bold' }}>{name}</span>
      <span>: {tags.join('+')}</span>
    </Paper>
  </Grid>
}

const contentOrEmpty = (content: React.JSX.Element[]) => content.length ? content : <span style={{ color: 'gray' }}>无</span>

const App: React.FC = () => {
  const [data, setData] = useState(_data)

  const items: Record<string, true> = { }
  data.items.forEach(it => (items[it] = true))
  const [selected, setSelected] = useState({} as Record<string, boolean>)

  const derivedResults: Record<string, string[]> = { }
  let length = 0
  let lastLength = 0
  do {
    lastLength = length
    for (const [key, value] of Object.entries(data.conditions)) {
      if (derivedResults[key]) continue
      if (value.every(it => selected[it])) {
        derivedResults[key] = value
        length++
      }
    }
  } while (length !== lastLength)

  return <Container maxWidth='sm'>
    <Typography variant='h4'>{data.title}</Typography>
    <Box sx={{ mt: 2 }}>
      <Typography variant='h6'>已有信息</Typography>
      <Grid container sx={{ mt: 1 }}>
        {data.tags.map(it => <Button
          variant={selected[it] ? 'contained' : 'outlined'}
          key={it}
          onClick={() => setSelected({ ...selected, [it]: !selected[it] })}
        >
          {it}
        </Button>)}
      </Grid>
    </Box>
    <Box sx={{ mt: 2 }}>
      <Typography variant='h6'>推导信息</Typography>
      <Grid container sx={{ mt: 1 }} spacing={1}>
        {contentOrEmpty(Object.entries(derivedResults).filter(([key]) => !items[key]).map(([key, values]) => <Item key={key} name={key} tags={values} />))}
      </Grid>
    </Box>
    <Box sx={{ mt: 2 }}>
      <Typography variant='h6'>结论</Typography>
      <Grid container sx={{ mt: 1 }} spacing={1}>
        {contentOrEmpty(data.items.filter(it => derivedResults[it]).map(it => <Item key={it} name={it} tags={derivedResults[it]} />))}
      </Grid>
    </Box>
    <Box sx={{ mt: 2 }}>
      <Typography variant='h6'>数据</Typography>
      <textarea style={{ width: '100%', height: 300 }} value={JSON.stringify(data, null, 2)} onChange={e => setData(JSON.parse(e.target.value))} />
    </Box>
  </Container>
}

export default App
