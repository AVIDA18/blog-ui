import { Grid, Button, Paper, Text, Title, Stack, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import classes from './Home.module.css';

export default function Home() {
    const cardHeight = 400; // Set the height of the large card

    const trendingArticles = [
        {
            image: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg',
            title: '10 Hidden Forests You Must See',
            author: 'John Doe',
        },
        {
            image: 'https://media.istockphoto.com/id/478627080/photo/evening-view-of-ama-dablam.jpg?s=612x612&w=0&k=20&c=GLKvtQt1JVoOB4yR2WI86_fYOmG8WObeZP_QV_gFG_0=',
            title: 'Mountains for Meditation',
            author: 'Jane Smith',
        },
        {
            image: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg',
            title: 'Wildlife Wonders Around the World',
            author: 'Alice Johnson',
        },
        {
            image: 'https://media.istockphoto.com/id/478627080/photo/evening-view-of-ama-dablam.jpg?s=612x612&w=0&k=20&c=GLKvtQt1JVoOB4yR2WI86_fYOmG8WObeZP_QV_gFG_0=',
            title: 'Rivers Worth Rafting',
            author: 'Mark Twain',
        },
        {
            image: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg',
            title: 'Best Hiking Trails for Fall',
            author: 'Sara Miles',
        },
    ];

    return (
        <div>
            {/* Hero Section */}
            <Grid m="md" gutter="md" align="stretch">
                {/* Left large card */}
                <Grid.Col span={8} sm={12}>
                    <Paper
                        shadow="md"
                        p="xl"
                        radius="md"
                        className={classes.card}
                        style={{
                            height: cardHeight,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <Text className={classes.category} size="xs">
                                <span className={classes.topContentCategory}>nature</span>
                            </Text>
                        </div>
                        <div>
                            <Title order={3} className={classes.title}>
                                Best forests to visit in North America
                            </Title>
                            <Text>By Author Name</Text>
                            <Button variant="white" color="dark" mt="md">
                                Read article
                            </Button>
                        </div>
                    </Paper>
                </Grid.Col>

                {/* Right stacked cards */}
                <Grid.Col span={4} sm={12}>
                    <Stack spacing="md" style={{ height: cardHeight }}>
                        {[1, 2].map((item) => (
                            <Paper
                                key={item}
                                shadow="xs"
                                p="md"
                                radius="md"
                                className={classes.card}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div>
                                    <Text className={classes.category} size="xs">
                                        <span className={classes.topContentCategory}>nature</span>
                                    </Text>
                                </div>
                                <div>
                                    <Title order={3} className={classes.title}>
                                        Best forests to visit in North America
                                    </Title>
                                    <Text>By Author Name</Text>
                                    <Button variant="white" color="dark" mt="md">
                                        Read article
                                    </Button>
                                </div>
                            </Paper>
                        ))}
                    </Stack>
                </Grid.Col>
            </Grid>

            {/* Trending Articles Carousel */}
            <Grid m="md">
                <Grid.Col span={12}>
                    <Title order={2} mb="sm">Trending Articles</Title>
                    <Carousel
                        withIndicators
                        height={320}
                        slideSize={{ base: '100%', sm: '50%', md: '33.3333%' }}
                        slideGap="md"
                        align="start"
                        emblaOptions={{ loop: true }}
                    >
                        {trendingArticles.map((article, index) => (
                            <Carousel.Slide key={index}>
                                <Paper shadow="sm" p="md" radius="md">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        height={160}
                                        radius="md"
                                        mb="sm"
                                    />
                                    <Title order={4}>{article.title}</Title>
                                    <Text size="sm" mb="xs">By {article.author}</Text>
                                    <Button variant="light" color="blue" size="xs">
                                        Read article
                                    </Button>
                                </Paper>
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                </Grid.Col>
            </Grid>

            {/* Explore More Articles Section */}
            <Grid m="md" gutter="md">
                <Grid.Col span={12}>
                    <Title order={2}>Explore More Articles</Title>
                </Grid.Col>
                <Grid.Col span={4} sm={12} md={4}>
                    <Paper shadow="xs" p="md" radius="md">
                        <Title order={4}>Top 5 National Parks in the US</Title>
                        <Text size="sm">By Author Name</Text>
                        <Button variant="light" color="blue" mt="md">Read more</Button>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={4} sm={12} md={4}>
                    <Paper shadow="xs" p="md" radius="md">
                        <Title order={4}>The Best Trails for Beginners</Title>
                        <Text size="sm">By Author Name</Text>
                        <Button variant="light" color="blue" mt="md">Read more</Button>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={4} sm={12} md={4}>
                    <Paper shadow="xs" p="md" radius="md">
                        <Title order={4}>Wildlife Photography Tips</Title>
                        <Text size="sm">By Author Name</Text>
                        <Button variant="light" color="blue" mt="md">Read more</Button>
                    </Paper>
                </Grid.Col>
            </Grid>
        </div>
    );
}
