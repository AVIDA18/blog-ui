import { Grid, Button, Paper, Text, Title, Stack, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import classes from './Home.module.css';

export default function Home() {
    const cardHeight = 400; // Set the height of the large card

    const trendingArticles = [
        {
            category: 'Forest',
            image: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg',
            content: 'Capture stunning wildlife moments with these professional tips and tricks that will take your photos to the next level...',
            title: '10 Hidden Forests You Must See',
            author: 'John Doe',
        },
        {
            category: 'Mountains',
            image: 'https://media.istockphoto.com/id/478627080/photo/evening-view-of-ama-dablam.jpg?s=612x612&w=0&k=20&c=GLKvtQt1JVoOB4yR2WI86_fYOmG8WObeZP_QV_gFG_0=',
            content: 'Explore the beauty of Americas national parks, from the grand Grand Canyon to the lush forests of the Pacific Northwest...',
            title: 'Mountains for Meditation',
            author: 'Jane Smith',
        },
        {
            category: 'Forest',
            image: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg',
            content: 'Capture stunning wildlife moments with these professional tips and tricks that will take your photos to the next level...',
            title: 'Wildlife Wonders Around the World',
            author: 'Alice Johnson',
        },
        {
            category: 'Mountains',
            image: 'https://media.istockphoto.com/id/478627080/photo/evening-view-of-ama-dablam.jpg?s=612x612&w=0&k=20&c=GLKvtQt1JVoOB4yR2WI86_fYOmG8WObeZP_QV_gFG_0=',
            content: 'Explore the beauty of Americas national parks, from the grand Grand Canyon to the lush forests of the Pacific Northwest...',
            title: 'Rivers Worth Rafting',
            author: 'Mark Twain',
        },
        {
            category: 'Forest',
            image: 'https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg',
            content: 'Capture stunning wildlife moments with these professional tips and tricks that will take your photos to the next level...',
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
                                    <Text className={classes.category} size="xs">
                                        <span className={classes.topContentCategory}>{article.category}</span>
                                    </Text>
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
            <div className={classes.exploreArticlesSection}>
                <Grid m="md" gutter="md" justify="center">
                    {trendingArticles.map((article, index) => (
                        <Grid.Col key={index} span={4} sm={12} md={4}>
                            <Paper className={classes.exploreArticlesCard}>
                                <Image src={article.image} alt={article.title} width={300} height={200} />
                                <a href="#" className={classes.exploreArticlesCardCategory}>
                                    <span>
                                        <Text className={classes.exploreArticlesCardCategoryText}>
                                            {article.category}
                                        </Text>
                                    </span>
                                </a>
                                <a href="#" className={classes.exploreArticlesCardTitle}>
                                    <Title order={4} className={classes.exploreArticlesCardTitleText}>
                                        {article.title}
                                    </Title>
                                </a>
                                <Text className={classes.exploreArticlesCardAuthor}>By {article.author}</Text>
                                <Text className={classes.exploreArticlesCardContent}>
                                    {article.content}
                                </Text>
                            </Paper>
                        </Grid.Col>
                    ))}
                </Grid>
            </div>




        </div>
    );
}
