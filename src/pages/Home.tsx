import { Container, Typography } from "@mui/material"

export const Home = () => {
    return <Container sx={{ height: '100%', textAlign: 'center', pt: 4 }}>
        <Typography
            component="h1"
            variant="h3"
            align="center"
            gutterBottom
        >
            Pioneer Constructions
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Something short and leading about the collection below—its contents,
            the creator, etc. Make it short and sweet, but not too short so folks
            don&apos;t simply skip over it entirely.
        </Typography>
    </Container >
}

export const HOME_ROUTE = '/'